import desktopIcon from '@icons/infocard/desktop.svg';
import envelopeIcon from '@icons/infocard/envelope.svg';
import { Event } from '@prisma/client';
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';

import React, { useEffect, useMemo, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';

import { fetchEvents } from '@/lib/apiRoutes';
import { useAppSelector } from '@/lib/hooks';

import { classroomTechInstructions } from './classroomTechInstructions';

const RoomSchedule = () => {
  const selectedRoom = useAppSelector((state) => state.ui.selectedRoom);
  console.log(selectedRoom);
  const today = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const [currentWeek, setCurrentWeek] = useState<Date>(today);
  const [dayOfWeek, setDayOfWeek] = useState<number>(today.getDay());
  const [weekEvents, setWeekEvents] = useState<Event[][] | null>(null);

  const startOfCurrentWeek = useMemo(
    () => startOfWeek(currentWeek, { weekStartsOn: 0 }),
    [currentWeek],
  );
  const endOfCurrentWeek = useMemo(
    () => endOfWeek(currentWeek, { weekStartsOn: 0 }),
    [currentWeek],
  );

  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek,
  });

  useEffect(() => {
    if (!selectedRoom) {
      return;
    }

    // fetch events for the current day
    setWeekEvents(null);

    fetchEvents(
      `${selectedRoom.floor.buildingCode} ${selectedRoom.name}`,
      startOfCurrentWeek.valueOf(),
      endOfCurrentWeek.valueOf(),
      setWeekEvents,
    );
  }, [selectedRoom, currentWeek, startOfCurrentWeek, endOfCurrentWeek]);

  const renderDatePicker = () => {
    const renderDateRow = () => {
      const dateText =
        format(startOfCurrentWeek, 'MMM d') +
        ' - ' +
        format(endOfCurrentWeek, 'MMM d');

      const handlePreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

      const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

      return (
        <div className="flex items-center justify-center gap-2">
          <FaChevronLeft
            onClick={handlePreviousWeek}
            className="cursor-pointer text-gray-600"
          />
          <div className="font-bold"> {dateText}</div>
          <FaChevronRight
            onClick={handleNextWeek}
            className="cursor-pointer text-gray-600"
          />
        </div>
      );
    };

    const renderWeekRow = () => {
      const renderDay = (day: Date) => {
        let classNames = 'w-7 text-sm text-center ';
        if (day.getDay() == dayOfWeek) {
          classNames += 'rounded-full bg-black text-white p-1';
        } else if (day.getTime() === today.getTime()) {
          classNames += 'text-blue-500 ';
        }

        return <div className={classNames}>{format(day, 'EEEEEE')}</div>;
      };

      return (
        <div className="mx-10 mt-2 flex items-center justify-between">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => setDayOfWeek(day.getDay())}
            >
              {renderDay(day)}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div>
        {renderDateRow()}
        {renderWeekRow()}
      </div>
    );
  };

  const renderContent = () => {
    if (weekEvents) {
      const formatDbDate = (time: Date) => {
        const date = new Date(time);

        const hoursUTC = date.getHours().toString().padStart(2, '0');
        const minutesUTC = date.getMinutes().toString().padStart(2, '0');
        return `${hoursUTC}:${minutesUTC}`;
      };

      if (weekEvents[dayOfWeek].length == 0) {
        return (
          <p className="mt-2 flex justify-center bg-gray-100 py-3 italic text-[--color-gray]">
            No Schedule This Day
          </p>
        );
      }

      return (
        <div className="mt-2 space-y-3 bg-gray-100 py-3 text-[--color-gray]">
          {weekEvents[dayOfWeek].map((event) => {
            const startTime = formatDbDate(event.startTime);
            const endTime = formatDbDate(event.endTime);

            return (
              <div key={event.id} className="flex justify-between px-2">
                <p>{event.name}</p>
                <p>
                  {startTime}-{endTime}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderScheduleButtons = () => {
    if (!selectedRoom) {
      return null;
    }

    const pdfLink =
      classroomTechInstructions[
        `${selectedRoom.floor.buildingCode}-${selectedRoom.name}`
      ];

    return (
      <div className="mx-3 flex gap-2.5 py-3">
        {/* Tech Guide Button */}
        {pdfLink && (
          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border-2 border-[#1e86ff] bg-transparent px-3 py-1 text-[#1e86ff]"
          >
            <img src={desktopIcon} alt="Tech Guide" className="h-5 w-5" />
            <p>Tech Guide</p>
          </a>
        )}

        {/* Change Reservation Button */}
        <a
          href="mailto:esrooms@andrew.cmu.edu"
          className="flex items-center gap-2 rounded-lg border-2 border-blue-300 bg-transparent px-3 py-1 text-blue-300"
        >
          <img
            src={envelopeIcon}
            alt="Change Reservation"
            className="h-5 w-5"
          />
          <p>Change Reservation</p>
        </a>
      </div>
    );
  };

  return (
    <div className="border-t-4 pt-3">
      {renderDatePicker()}
      {renderContent()}
      {renderScheduleButtons()}
    </div>
  );
};

export default RoomSchedule;
