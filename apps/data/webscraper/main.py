from scrape_25live.cookie_extractor import scrape_25live
import schedule
from dotenv import load_dotenv
import time

load_dotenv()


def run_scrape():
    scrape_25live()


if __name__ == "__main__":
    # run immediately for testing
    run_scrape()

    # run every day at 12:00 AM with cron
    schedule.every().day.at("00:00").do(run_scrape)
    while True:
        schedule.run_pending()
        time.sleep(1)
