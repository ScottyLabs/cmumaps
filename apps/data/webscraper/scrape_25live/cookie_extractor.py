#!/usr/bin/env python3

import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from dotenv import load_dotenv
from utils import get_driver
import os

load_dotenv()

USERNAME = os.getenv("SVC_ACCOUNT_USERNAME")
PASSWORD = os.getenv("SVC_ACCOUNT_PASSWORD")


def extract_cookies_with_search():
    print("Extracting cookies...")
    driver = get_driver()

    try:
        # Login
        driver.get("https://25live.collegenet.com/cmu/")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )

        username_field = driver.find_element(By.ID, "username")
        password_field = driver.find_element(By.ID, "passwordinput")

        username_field.send_keys(USERNAME)
        password_field.send_keys(PASSWORD)
        # credentials for logging in

        login_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        login_button.click()

        WebDriverWait(driver, 15).until(
            lambda d: "25live.collegenet.com" in d.current_url
            and "login" not in d.current_url
        )

        # calendar for scraping cookie
        driver.get("https://25live.collegenet.com/pro/cmu#!/home/calendar")
        time.sleep(3)

        # search dropdown
        dropdown = driver.find_element(
            By.CSS_SELECTOR, "div.ngInlineBlock.ngCompdropdown"
        )
        dropdown.click()
        time.sleep(2)

        # list for locations to manually type in, editable if more locations needed
        search_terms = ["5th ave commons", "athletics"]

        results = {}
        # storing everything here

        # search and get cookies
        for search_term in search_terms:
            try:
                dropdown = driver.find_element(
                    By.CSS_SELECTOR, "div.ngInlineBlock.ngCompdropdown"
                )
                dropdown.click()
                time.sleep(2)

                search_input_selectors = [
                    "input[placeholder*='search']",
                    "input[type='search']",
                    ".search-container input",
                    ".select2-search input",
                    "input[class*='search']",
                ]

                search_input = None
                for selector in search_input_selectors:
                    try:
                        search_input = driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue

                if search_input:
                    # clearnig and retyping new search term
                    search_input.clear()
                    search_input.send_keys(search_term)
                    time.sleep(2)

                    result_selectors = [
                        "li.ngDropdownItemEl:not(.ngDropdownGroup)",
                        "li.select2-result-label:not(.ngDropdownGroup)",
                        ".select2-results li:not(.ngDropdownGroup)",
                        "li[class*='ngDropdownItemEl']:not([class*='ngDropdownGroup'])",
                    ]

                    first_result = None
                    for selector in result_selectors:
                        try:
                            results_list = driver.find_elements(
                                By.CSS_SELECTOR, selector
                            )
                            for result in results_list:
                                if result.is_displayed() and result.is_enabled():
                                    if "ngDropdownGroup" not in result.get_attribute(
                                        "class"
                                    ):
                                        first_result = result
                                        break
                            if first_result:
                                break
                        except NoSuchElementException:
                            continue

                    if first_result:
                        first_result.click()
                        time.sleep(3)

                        # getting the cookies
                        cookies = driver.get_cookies()
                        cookie_string = "; ".join(
                            [f"{c['name']}={c['value']}" for c in cookies]
                        )

                        results[search_term] = {
                            "search_term": search_term,
                            "cookies": cookie_string,
                            "status": "success",
                        }

                    else:
                        results[search_term] = {
                            "search_term": search_term,
                            "cookies": None,
                            "status": "no_results_found",
                        }

                else:
                    results[search_term] = {
                        "search_term": search_term,
                        "cookies": None,
                        "status": "search_input_not_found",
                    }

                time.sleep(2)

            except Exception as e:
                results[search_term] = {
                    "search_term": search_term,
                    "cookies": None,
                    "status": f"error: {str(e)}",
                }
                continue

        return results

    except Exception:
        return None
    finally:
        if driver:
            driver.quit()


def scrape_25live():
    results = extract_cookies_with_search()

    if results:
        print(f"Printing out {len(results)} search terms:")

        for search_term, result in results.items():
            print(f"{search_term}")
            print(f"{result['status']}")
            if result["cookies"]:
                print(f"cookie: {result['cookies']}")
            else:
                print("No cookie")
            print("-" * 40)

        print("Results saved")
    else:
        print("Failed")


if __name__ == "__main__":
    scrape_25live()
