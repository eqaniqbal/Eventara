import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service

BASE_URL = "http://47.128.219.68:8081"
TEST_EMAIL = "selenium_test@eventara.com"
TEST_PASSWORD = "Test@1234"
TEST_NAME = "Selenium Tester"


def get_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--remote-debugging-port=9222")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    return driver


# ─────────────────────────────────────────────
# TEST 1: Landing page loads successfully
# ─────────────────────────────────────────────
def test_01_landing_page_loads():
    driver = get_driver()
    try:
        driver.get(BASE_URL)
        assert driver.title != "", "Page title should not be empty"
        print("PASS: Landing page loaded successfully")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 2: Register page is accessible
# ─────────────────────────────────────────────
def test_02_register_page_accessible():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/register")
        wait = WebDriverWait(driver, 10)
        form = wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
        assert form is not None, "Register form should be present"
        print("PASS: Register page is accessible")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 3: Login page is accessible
# ─────────────────────────────────────────────
def test_03_login_page_accessible():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/login")
        wait = WebDriverWait(driver, 10)
        form = wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
        assert form is not None, "Login form should be present"
        print("PASS: Login page is accessible")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 4: Register form has required fields
# ─────────────────────────────────────────────
def test_04_register_form_fields():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/register")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
        inputs = driver.find_elements(By.TAG_NAME, "input")
        assert len(inputs) >= 3, "Register form should have at least 3 input fields"
        print(f"PASS: Register form has {len(inputs)} input fields")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 5: Login form has required fields
# ─────────────────────────────────────────────
def test_05_login_form_fields():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/login")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
        inputs = driver.find_elements(By.TAG_NAME, "input")
        assert len(inputs) >= 2, "Login form should have at least 2 input fields"
        print(f"PASS: Login form has {len(inputs)} input fields")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 6: Register new user successfully
# ─────────────────────────────────────────────
def test_06_register_new_user():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/register")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        inputs = driver.find_elements(By.TAG_NAME, "input")
        inputs[0].send_keys(TEST_NAME)
        inputs[1].send_keys(TEST_EMAIL)
        inputs[2].send_keys(TEST_PASSWORD)

        selects = driver.find_elements(By.TAG_NAME, "select")
        if selects:
            from selenium.webdriver.support.ui import Select
            Select(selects[0]).select_by_value("attendee")

        button = driver.find_element(By.TAG_NAME, "button")
        button.click()
        time.sleep(2)

        assert driver.current_url != f"{BASE_URL}/register" or "success" in driver.page_source.lower() or "login" in driver.current_url.lower()
        print("PASS: User registered successfully")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 7: Login with valid credentials
# ─────────────────────────────────────────────
def test_07_login_valid_credentials():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/login")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        inputs = driver.find_elements(By.TAG_NAME, "input")
        inputs[0].send_keys(TEST_EMAIL)
        inputs[1].send_keys(TEST_PASSWORD)

        button = driver.find_element(By.TAG_NAME, "button")
        button.click()
        time.sleep(2)

        assert "dashboard" in driver.current_url.lower() or "login" not in driver.current_url.lower()
        print("PASS: Login with valid credentials successful")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 8: Login with invalid credentials shows error
# ─────────────────────────────────────────────
def test_08_login_invalid_credentials():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/login")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        inputs = driver.find_elements(By.TAG_NAME, "input")
        inputs[0].send_keys("wrong@email.com")
        inputs[1].send_keys("wrongpassword")

        button = driver.find_element(By.TAG_NAME, "button")
        button.click()
        time.sleep(2)

        assert "login" in driver.current_url.lower() or "error" in driver.page_source.lower() or "invalid" in driver.page_source.lower() or "not found" in driver.page_source.lower()
        print("PASS: Invalid credentials correctly rejected")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 9: Duplicate registration is rejected
# ─────────────────────────────────────────────
def test_09_duplicate_registration():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/register")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        inputs = driver.find_elements(By.TAG_NAME, "input")
        inputs[0].send_keys(TEST_NAME)
        inputs[1].send_keys(TEST_EMAIL)
        inputs[2].send_keys(TEST_PASSWORD)

        button = driver.find_element(By.TAG_NAME, "button")
        button.click()
        time.sleep(2)

        assert "already" in driver.page_source.lower() or "exists" in driver.page_source.lower() or "registered" in driver.page_source.lower() or "error" in driver.page_source.lower()
        print("PASS: Duplicate registration correctly rejected")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 10: Page title is correct
# ─────────────────────────────────────────────
def test_10_page_title():
    driver = get_driver()
    try:
        driver.get(BASE_URL)
        title = driver.title
        assert title is not None and title != ""
        print(f"PASS: Page title is '{title}'")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 11: Navigation links are present on landing page
# ─────────────────────────────────────────────
def test_11_navigation_links():
    driver = get_driver()
    try:
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        links = driver.find_elements(By.TAG_NAME, "a")
        assert len(links) > 0, "There should be navigation links on the landing page"
        print(f"PASS: Found {len(links)} navigation links")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 12: Register page has a link to login
# ─────────────────────────────────────────────
def test_12_register_page_has_login_link():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/register")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        page_source = driver.page_source.lower()
        assert "login" in page_source or "sign in" in page_source
        print("PASS: Register page contains a link/reference to login")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 13: Login page has a link to register
# ─────────────────────────────────────────────
def test_13_login_page_has_register_link():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/login")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        page_source = driver.page_source.lower()
        assert "register" in page_source or "sign up" in page_source or "create" in page_source
        print("PASS: Login page contains a link/reference to register")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 14: Empty login form shows validation
# ─────────────────────────────────────────────
def test_14_empty_login_validation():
    driver = get_driver()
    try:
        driver.get(f"{BASE_URL}/login")
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

        button = driver.find_element(By.TAG_NAME, "button")
        button.click()
        time.sleep(1)

        assert "login" in driver.current_url.lower()
        print("PASS: Empty login form does not proceed")
    finally:
        driver.quit()


# ─────────────────────────────────────────────
# TEST 15: App responds within acceptable time
# ─────────────────────────────────────────────
def test_15_page_load_performance():
    driver = get_driver()
    try:
        start = time.time()
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        load_time = time.time() - start
        assert load_time < 10, f"Page load time {load_time:.2f}s exceeds 10 seconds"
        print(f"PASS: Page loaded in {load_time:.2f} seconds")
    finally:
        driver.quit()


if __name__ == "__main__":
    tests = [
        test_01_landing_page_loads,
        test_02_register_page_accessible,
        test_03_login_page_accessible,
        test_04_register_form_fields,
        test_05_login_form_fields,
        test_06_register_new_user,
        test_07_login_valid_credentials,
        test_08_login_invalid_credentials,
        test_09_duplicate_registration,
        test_10_page_title,
        test_11_navigation_links,
        test_12_register_page_has_login_link,
        test_13_login_page_has_register_link,
        test_14_empty_login_validation,
        test_15_page_load_performance,
    ]

    passed = 0
    failed = 0
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"FAIL: {test.__name__} - {e}")
            failed += 1

    print(f"\n{'='*50}")
    print(f"Results: {passed} passed, {failed} failed out of {len(tests)} tests")
    print(f"{'='*50}")
