import os
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from dotenv import load_dotenv

load_dotenv()


# https://github.com/brody192/selenium-example/blob/main/main.mjs
def _get_chrome_options():
    chrome_options = Options()
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-background-timer-throttling")
    chrome_options.add_argument("--disable-backgrounding-occluded-windows")
    chrome_options.add_argument("--disable-breakpad")
    chrome_options.add_argument("--disable-component-extensions-with-background-pages")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-features=TranslateUI,BlinkGenPropertyTrees")
    chrome_options.add_argument("--disable-ipc-flooding-protection")
    chrome_options.add_argument("--disable-renderer-backgrounding")
    chrome_options.add_argument(
        "--enable-features=NetworkService,NetworkServiceInProcess"
    )
    chrome_options.add_argument("--force-color-profile=srgb")
    chrome_options.add_argument("--hide-scrollbars")
    chrome_options.add_argument("--metrics-recording-only")
    chrome_options.add_argument("--mute-audio")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.set_capability("browserless:token", os.environ.get("BROWSER_TOKEN"))
    return chrome_options


def get_driver():
    webdriver_endpoint = os.environ.get("BROWSER_WEBDRIVER_ENDPOINT")
    chrome_options = _get_chrome_options()
    driver = webdriver.Remote(
        command_executor=webdriver_endpoint, options=chrome_options
    )
    return driver


if __name__ == "__main__":
    driver = get_driver()

    try:
        driver.get("https://example.com/")
        base64_png = driver.get_screenshot_as_base64()

        with open("webscraper/screenshot.png", "wb") as f:
            f.write(base64.b64decode(base64_png))
    finally:
        driver.quit()
