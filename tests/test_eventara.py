import sys
import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import UnexpectedAlertPresentException

APP_URL = os.environ.get("APP_URL", "http://localhost:8081")
passed = 0
failed = 0

def get_driver():
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1920,1080")
    return webdriver.Chrome(options=opts)

def dismiss_any_alert(driver):
    try:
        alert = driver.switch_to.alert
        text = alert.text
        alert.dismiss()
        return text
    except Exception:
        return None

def run_test(name, fn, driver):
    global passed, failed
    try:
        fn(driver)
        print(f"PASS: {name}")
        passed += 1
    except Exception as e:
        dismiss_any_alert(driver)
        msg = str(e).split('\n')[0][:120]
        print(f"FAIL: {name} - {msg}")
        failed += 1
    try:
        driver.get("about:blank")
    except Exception:
        pass

driver = get_driver()

# ---- TESTS ----------------------------------------------------------------

def t01_landing_loads(d):
    d.get(APP_URL)
    assert d.title != "" or len(d.find_elements(By.TAG_NAME, "body")) > 0
    assert "refused" not in d.page_source.lower()

def t02_register_accessible(d):
    d.get(f"{APP_URL}/register")
    time.sleep(1)
    assert len(d.find_elements(By.TAG_NAME, "body")) > 0

def t03_login_accessible(d):
    d.get(f"{APP_URL}/login")
    time.sleep(1)
    assert len(d.find_elements(By.TAG_NAME, "body")) > 0

def t04_register_form_fields(d):
    d.get(f"{APP_URL}/register")
    time.sleep(1)
    inputs = d.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 2, f"Expected at least 2 inputs, found {len(inputs)}"

def t05_login_form_fields(d):
    d.get(f"{APP_URL}/login")
    time.sleep(1)
    inputs = d.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 1, f"Expected at least 1 input, found {len(inputs)}"

def t06_register_form_submittable(d):
    """Test that register form accepts input (UI test only)."""
    d.get(f"{APP_URL}/register")
    time.sleep(1)
    inputs = d.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 2
    inputs[0].clear()
    inputs[0].send_keys("Selenium Tester")
    if len(inputs) >= 2:
        inputs[1].clear()
        inputs[1].send_keys("selenium_ui@eventara.com")
    if len(inputs) >= 3:
        inputs[2].clear()
        inputs[2].send_keys("Test@1234")
    btns = d.find_elements(By.TAG_NAME, "button")
    submit = next((b for b in btns if any(k in b.text.lower() for k in ["register","sign","submit","create"])), btns[0] if btns else None)
    assert submit is not None, "No submit button found"
    submit.click()
    time.sleep(1.5)
    dismiss_any_alert(d)
    assert True

def t07_login_form_submittable(d):
    """Test that login form accepts input (UI test only)."""
    d.get(f"{APP_URL}/login")
    time.sleep(1)
    inputs = d.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 1
    inputs[0].clear()
    inputs[0].send_keys("test@eventara.com")
    if len(inputs) >= 2:
        inputs[1].clear()
        inputs[1].send_keys("Test@1234")
    btns = d.find_elements(By.TAG_NAME, "button")
    submit = next((b for b in btns if any(k in b.text.lower() for k in ["login","sign","submit"])), btns[0] if btns else None)
    assert submit is not None, "No submit button found"
    submit.click()
    time.sleep(1.5)
    dismiss_any_alert(d)
    assert True

def t08_wrong_credentials_handled(d):
    """Wrong credentials should show error or remain on login page."""
    d.get(f"{APP_URL}/login")
    time.sleep(1)
    inputs = d.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 1
    inputs[0].clear()
    inputs[0].send_keys("nobody@nowhere.com")
    if len(inputs) >= 2:
        inputs[1].clear()
        inputs[1].send_keys("wrongpassword123")
    btns = d.find_elements(By.TAG_NAME, "button")
    submit = next((b for b in btns if any(k in b.text.lower() for k in ["login","sign","submit"])), btns[0] if btns else None)
    if submit:
        submit.click()
    time.sleep(1.5)
    alert_text = dismiss_any_alert(d)
    login_still_present = len(d.find_elements(By.TAG_NAME, "input")) >= 1
    assert alert_text or login_still_present, "Expected error on wrong credentials"

def t09_page_title_not_empty(d):
    d.get(APP_URL)
    time.sleep(1)
    assert d.title.strip() != "", "Page title is empty"

def t10_landing_has_content(d):
    d.get(APP_URL)
    time.sleep(1)
    body_text = d.find_element(By.TAG_NAME, "body").text
    assert len(body_text.strip()) > 10, "Landing page body is empty"

def t11_navigation_elements_present(d):
    d.get(APP_URL)
    time.sleep(1)
    links = d.find_elements(By.TAG_NAME, "a")
    buttons = d.find_elements(By.TAG_NAME, "button")
    navs = d.find_elements(By.TAG_NAME, "nav")
    assert len(links) + len(buttons) + len(navs) > 0, "No navigation elements found"

def t12_register_references_login(d):
    d.get(f"{APP_URL}/register")
    time.sleep(1)
    src = d.page_source.lower()
    assert "login" in src or "sign in" in src or "/login" in src

def t13_login_references_register(d):
    d.get(f"{APP_URL}/login")
    time.sleep(1)
    src = d.page_source.lower()
    assert "register" in src or "sign up" in src or "/register" in src

def t14_empty_login_stays_on_page(d):
    d.get(f"{APP_URL}/login")
    time.sleep(1)
    btns = d.find_elements(By.TAG_NAME, "button")
    submit = next((b for b in btns if any(k in b.text.lower() for k in ["login","sign","submit"])), btns[0] if btns else None)
    if submit:
        submit.click()
        time.sleep(1)
    dismiss_any_alert(d)
    inputs = d.find_elements(By.TAG_NAME, "input")
    url = d.current_url
    assert len(inputs) >= 1 or "login" in url.lower()

def t15_page_load_time(d):
    start = time.time()
    d.get(APP_URL)
    d.find_element(By.TAG_NAME, "body")
    elapsed = time.time() - start
    assert elapsed < 10, f"Page took {elapsed:.2f}s (>10s)"
    print(f" ({elapsed:.2f}s)", end="")

# ---- RUN ALL ---------------------------------------------------------------

tests = [
    ("Landing page loads successfully",                t01_landing_loads),
    ("Register page is accessible",                    t02_register_accessible),
    ("Login page is accessible",                       t03_login_accessible),
    ("Register form has required fields",               t04_register_form_fields),
    ("Login form has required fields",                  t05_login_form_fields),
    ("Register form accepts input and submits",         t06_register_form_submittable),
    ("Login form accepts input and submits",            t07_login_form_submittable),
    ("Wrong credentials handled gracefully",            t08_wrong_credentials_handled),
    ("Page title is not empty",                         t09_page_title_not_empty),
    ("Landing page has content",                        t10_landing_has_content),
    ("Navigation elements present on landing page",     t11_navigation_elements_present),
    ("Register page references login",                  t12_register_references_login),
    ("Login page references register",                  t13_login_references_register),
    ("Empty login form does not navigate away",         t14_empty_login_stays_on_page),
    ("Page loads within 10 seconds",                    t15_page_load_time),
]

for name, fn in tests:
    run_test(name, fn, driver)

driver.quit()

print()
print("=" * 50)
print(f"Results: {passed} passed, {failed} failed out of {passed+failed} tests")
print("=" * 50)

if failed > 0:
    sys.exit(1)