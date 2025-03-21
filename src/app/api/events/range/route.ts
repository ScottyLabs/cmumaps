import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';

type Event = {
  id: string;
  name: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  roomName: string;
};

async function retrieveEvents(
  roomName: string | undefined,
  startDate: string,
  endDate: string,
) {
  const events = await prisma.event.findMany({
    orderBy: [{ startTime: 'asc' }],
    where: {
      roomName,
      date: {
        lte: endDate,
        gte: startDate,
      },
    },
  });

  return events;
}

export async function GET(req: NextRequest) {
  const [roomName, _startDate, _endDate] = [
    req.headers.get('roomName') || undefined,
    req.headers.get('startDate'),
    req.headers.get('endDate'),
  ];

  if (!_startDate || !_endDate) {
    return Response.error();
  }
  const startDate = new Date(parseInt(_startDate)).toISOString();
  const endDate = new Date(parseInt(_endDate)).toISOString();

  const events = await retrieveEvents(roomName, startDate, endDate);

  const groupedEvents: Event[][] = [];
  let date = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const dateEvents = events.filter(
      (event) =>
        event.date.getUTCDate() == date.getUTCDate() &&
        event.date.getUTCMonth() == date.getUTCMonth(),
    );

    groupedEvents.push(dateEvents);
    date = new Date(date.valueOf() + 60 * 60 * 24 * 1000); // Increment date by 1 day
  }

  return Response.json(groupedEvents);
}
