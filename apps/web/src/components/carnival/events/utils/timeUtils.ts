export const carnivalDates = ["3/28-4/6", "4/3", "4/4", "4/5"] as const;

export type CarnivalDate = (typeof carnivalDates)[number];

const dateToTimestamp = {
  "4/3": new Date(2025, 3, 3).getTime(),
  "4/4": new Date(2025, 3, 4).getTime(),
  "4/5": new Date(2025, 3, 5).getTime(),
};

export const getTimestampByDate = (date: CarnivalDate) => {
  if (date === "3/28-4/6") {
    return Date.now();
  }

  return dateToTimestamp[date];
};
