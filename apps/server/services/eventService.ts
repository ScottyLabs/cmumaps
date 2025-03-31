export const eventService = {
  // get next 10 numbers
  async getEvents(index: number, limit: number) {
    return Array.from({ length: limit }, (_, i) => index + i);
  },
};
