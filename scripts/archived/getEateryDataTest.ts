/* eslint-disable @typescript-eslint/no-explicit-any */
import { EateryInfo } from '../../src/types';

const daysOfWeek = [
  'Sunday', // 0
  'Monday', // 1
  'Tuesday', // 2
  'Wednesday', // 3
  'Thursday', // 4
  'Friday', // 5
  'Saturday', // 6
];

interface CmuEatsTimeType {
  day: number;
  hour: number;
  minute: number;
}

interface CmuEatsTimeIntervalType {
  start: CmuEatsTimeType;
  end: CmuEatsTimeType;
}

export const getEateryData = async () => {
  // const cmueatsData = [
  //   {
  //     times: [
  //       {
  //         start: { day: 0, hour: 1, minute: 0 },
  //         end: { day: 0, hour: 2, minute: 0 },
  //       },
  //       {
  //         start: { day: 0, hour: 3, minute: 0 },
  //         end: { day: 0, hour: 4, minute: 0 },
  //       },
  //     ],
  //   },
  // ];

  const response = await fetch('https://dining.apis.scottylabs.org/locations/');
  const cmueatsData = (await response.json())['locations'];

  const now = new Date();
  const currentDay = now.getDay();

  // a ChatGPT generated function that converts CmuEatsTimeType to Date
  function convertToDate({ day, hour, minute }: CmuEatsTimeType): Date {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Create a new date object set to the current date
    const date = new Date(now);

    // Calculate the date of the desired day
    const daysUntilTarget = (day - currentDay + 7) % 7;
    date.setDate(now.getDate() + daysUntilTarget);

    // Set the desired hour and minute
    date.setHours(hour, minute, 0, 0);

    return date;
  }

  // get difference in hour between two times
  const getHourDif = (startTime: Date, endDate: Date) => {
    const timeDifference = endDate.getTime() - startTime.getTime();

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60); // milliseconds to hours

    return hoursDifference;
  };

  // helper function to assign statusMsg and locationState when the eatery is closed
  // determine if it is minutes, hours, or days
  const closeHelper = (nextDate: Date, res: Partial<EateryInfo>) => {
    const hourDif = getHourDif(now, nextDate);

    if (hourDif < 1) {
      res.locationState = 'OPENS_SOON';
      res.statusMsg = `Close (${Math.round(hourDif * 60)} minutes until open)`;
    } else if (hourDif < 24) {
      res.locationState = 'CLOSED';
      res.statusMsg = `Open (${Math.round(hourDif)} hours until open)`;
    } else {
      res.locationState = 'CLOSED';
      res.statusMsg = `Close (${Math.ceil(hourDif / 24)} days until open on ${daysOfWeek[nextDate.getDay()]})`;
    }
  };

  const getStatusMsgAndLocationState = (
    eatery: any,
    curTime: CmuEatsTimeIntervalType | undefined,
    res: Partial<EateryInfo>,
  ) => {
    // if the eatery opens today
    if (curTime) {
      const startTime = convertToDate(curTime.start);
      const endTime = convertToDate(curTime.end);

      // when open
      if (now >= startTime && now <= endTime) {
        const hourDif = getHourDif(now, endTime);

        // message depend on if more than an hour until closing
        if (hourDif > 1) {
          res.locationState = 'OPEN';
          res.statusMsg = `Open (${Math.round(hourDif)} hours until close)`;
        } else {
          res.locationState = 'CLOSES_SOON';
          res.statusMsg = `Open (${Math.round(hourDif * 60)} minutes until close)`;
        }
      }
      // when close
      else {
        // if today's time interval haven't started
        if (now < startTime) {
          closeHelper(startTime, res);
        }

        // otherwise get the next index
        const todayIndex = eatery.times.findIndex(
          (time: CmuEatsTimeIntervalType) => time.start.day == currentDay,
        );

        const nextTime = eatery.times[(todayIndex + 1) % eatery.times.length];

        // edge case where are multiple time intervals in the same day
        if (nextTime.start.day == currentDay) {
          getStatusMsgAndLocationState(eatery, nextTime, res);
          return;
        }

        const nextDate = convertToDate(nextTime.start);
        closeHelper(nextDate, res);
      }
    }
    // if the eatery is closed today
    else {
      // wrap the times by appending the first element to the end of the array
      const firstElement = JSON.parse(JSON.stringify(eatery.times[0]));
      firstElement.start.day += 7;
      firstElement.end.day += 7;
      eatery.times.push(firstElement);

      // the next interval if the first interval where day is greater than today's day
      const nextTimeInterval = eatery.times.find(
        (time: CmuEatsTimeIntervalType) => time.start.day > currentDay,
      );
      const nextDate = convertToDate(nextTimeInterval.start);
      closeHelper(nextDate, res);
    }
  };

  const parseEatery = (eatery: any): EateryInfo => {
    const res: Partial<EateryInfo> = {};
    res.name = eatery.name;
    res.url = eatery.url;
    res.shortDescription = eatery.shortDescription;

    if (eatery.times.length == 0) {
      res.locationState = 'CLOSED_LONG_TERM';
    } else {
      // the initial curTime is the first entry where the day is today's day
      const curTime = eatery['times'].find(
        (time: CmuEatsTimeIntervalType) => time.start.day == currentDay,
      );
      getStatusMsgAndLocationState(eatery, curTime, res);
    }

    return res as EateryInfo;
  };

  console.log(cmueatsData.map((eatery: any) => parseEatery(eatery)));
};

getEateryData();