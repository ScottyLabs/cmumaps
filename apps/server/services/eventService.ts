export const eventService = {
  // get next 10 numbers
  async getEvents(index: number) {
    return Array.from({ length: 10 }, (_, i) => index + i);
  },
};
