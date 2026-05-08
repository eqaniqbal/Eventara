import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = os.environ.get("APP_URL", "http://47.128.219.68:8081")
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
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    return driver

passed = 0
failed = 0
driver = get_driver()

def run_test(name, fn):
    global passed, failed
    try:
        fn()
        print(f"PASS: {name}")
        passed += 1
    except Exception as e:
        print(f"FAIL: {name} - {e}")
        failed += 1

# Test 1
def t1():
    driver.get(BASE_URL)
    assert driver.title != ""
run_test("Landing page loads successfully", t1)

# Test 2
def t2():
    driver.get(f"{BASE_URL}/register")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
run_test("Register page is accessible", t2)

# Test 3
def t3():
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
run_test("Login page is accessible", t3)

# Test 4
def t4():
    driver.get(f"{BASE_URL}/register")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    inputs = driver.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 3
run_test("Register form has required fields", t4)

# Test 5
def t5():
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    inputs = driver.find_elements(By.TAG_NAME, "input")
    assert len(inputs) >= 2
run_test("Login form has required fields", t5)

# Test 6
def t6():
    driver.get(f"{BASE_URL}/register")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    inputs = driver.find_elements(By.TAG_NAME, "input")
    inputs[0].clear()
    inputs[0].send_keys(TEST_NAME)
    inputs[1].clear()
    inputs[1].send_keys(TEST_EMAIL)
    inputs[2].clear()
    inputs[2].send_keys(TEST_PASSWORD)
    driver.find_element(By.TAG_NAME, "button").click()
    time.sleep(2)
run_test("Register new user", t6)

# Test 7
def t7():
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    inputs = driver.find_elements(By.TAG_NAME, "input")
    inputs[0].clear()
    inputs[0].send_keys(TEST_EMAIL)
    inputs[1].clear()
    inputs[1].send_keys(TEST_PASSWORD)
    driver.find_element(By.TAG_NAME, "button").click()
    time.sleep(2)
    assert "login" not in driver.current_url.lower() or "dashboard" in driver.page_source.lower()
run_test("Login with valid credentials", t7)

# Test 8
def t8():
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    inputs = driver.find_elements(By.TAG_NAME, "input")
    inputs[0].clear()
    inputs[0].send_keys("wrong@email.com")
    inputs[1].clear()
    inputs[1].send_keys("wrongpassword")
    driver.find_element(By.TAG_NAME, "button").click()
    time.sleep(2)
    assert "login" in driver.current_url.lower() or "error" in driver.page_source.lower() or "not found" in driver.page_source.lower()
run_test("Login with invalid credentials shows error", t8)

# Test 9
def t9():
    driver.get(f"{BASE_URL}/register")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    inputs = driver.find_elements(By.TAG_NAME, "input")
    inputs[0].clear()
    inputs[0].send_keys(TEST_NAME)
    inputs[1].clear()
    inputs[1].send_keys(TEST_EMAIL)
    inputs[2].clear()
    inputs[2].send_keys(TEST_PASSWORD)
    driver.find_element(By.TAG_NAME, "button").click()
    time.sleep(2)
    assert "already" in driver.page_source.lower() or "exists" in driver.page_source.lower() or "registered" in driver.page_source.lower() or "error" in driver.page_source.lower()
run_test("Duplicate registration is rejected", t9)

# Test 10
def t10():
    driver.get(BASE_URL)
    assert driver.title is not None and driver.title != ""
run_test("Page title is not empty", t10)

# Test 11
def t11():
    driver.get(BASE_URL)
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    links = driver.find_elements(By.TAG_NAME, "a")
    assert len(links) > 0
run_test("Navigation links are present", t11)

# Test 12
def t12():
    driver.get(f"{BASE_URL}/register")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    assert "login" in driver.page_source.lower() or "sign in" in driver.page_source.lower()
run_test("Register page has login link", t12)

# Test 13
def t13():
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    assert "register" in driver.page_source.lower() or "sign up" in driver.page_source.lower()
run_test("Login page has register link", t13)

# Test 14
def t14():
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    driver.find_element(By.TAG_NAME, "button").click()
    time.sleep(1)
    assert "login" in driver.current_url.lower()
run_test("Empty login form does not proceed", t14)

# Test 15
def t15():
    start = time.time()
    driver.get(BASE_URL)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    load_time = time.time() - start
    assert load_time < 10
run_test("Page loads within 10 seconds", t15)

driver.quit()

print(f"\n{'='*50}")
print(f"Results: {passed} passed, {failed} failed out of {passed+failed} tests")
print(f"{'='*50}")

if failed > 0:
    exit(1)
