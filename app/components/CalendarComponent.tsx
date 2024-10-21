import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types';
import { dateInDutch, formatEvents } from '../utils';
import { addDays, format, isSameDay, isAfter, startOfDay, getHours, getMinutes} from 'date-fns';

const CalendarComponent = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const today = startOfDay(new Date());

  // Fetch the events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/events');
        const rawEvents = await response.json();
        const formattedEvents = formatEvents(rawEvents);

        // Filter events to show only those happening today and the next 6 days
        const filteredEvents = formattedEvents.filter(event => {
          const eventDate = new Date(event.startTime);
          return isAfter(eventDate, today) || isSameDay(eventDate, today);
        });
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Create an array for the current day and the next 6 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  // Calculate the earliest event start time for the week
  const earliestStartTime = events.reduce((earliest, event) => {
    const eventStart = new Date(event.startTime);
    return eventStart < earliest ? eventStart : earliest;
  }, new Date(events[0]?.startTime || new Date())); // Start with the first event as the initial value

  const earliestHour = getHours(earliestStartTime);  // Get the hour of the earliest event

  const totalHours = 24 - earliestHour;
  const hours = Array.from({ length: totalHours }, (_, i) => earliestHour + i); // Modified

  console.log(`earliest hour: ${earliestHour}\nhours: ${hours}`);
   
  // Utility function to handle row calculation
  const calculateRowPosition = (title: string, date: Date, isEnd: boolean = false) => {
    const hour = getHours(date);
    const minutes = getMinutes(date);
    const hasHalfHour = Math.floor(minutes / 30) == 1 ? true : false;

    if (hour === 0) {
      return totalHours * 2;
    }

    console.log(`hour: ${hour}\nminutes: ${minutes}`)
    const position = ((hour - earliestHour) * 2) + (hasHalfHour ? 1 : 0) + 1; // Each row represents 30 minutes, +2 for header
    console.log(`${isEnd === true ? "end" : "start"}position for ${title}: ${position}`);
    return position;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid grid-cols-1  gap-4 w-full">
          {/* Mobile (Schedule Layout) */}
          <div className="md:hidden h-[60vh] overflow-y-auto scroll-snap-y">
            {days.map(day => (
              <div key={day.toString()} className="scroll-snap-start py-4 border-b">
                <h2 className="text-lg font-semibold mb-2">{format(day, 'EEEE, MMMM d')}</h2>
                <ul>
                  {events
                    .filter(event => isSameDay(new Date(event.startTime), day))
                    .map(event => (
                      <li key={event.id} className="mb-4">
                        <a
                          href={event.htmlLink || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black block bg-blue-100 p-4 rounded-lg shadow hover:bg-blue-200"
                        >
                          <p className="font-bold">{event.title}</p>
                          <p>
                            {format(new Date(event.startTime), 'p')} -{' '}
                            {format(new Date(event.endTime), 'p')}
                          </p>
                          <p className="text-sm text-gray-700">{event.description}</p>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Desktop (Timetable Layout) */}
          <div className="hidden md:block w-full">
            <div className="grid grid-cols-7 relative gap-4 h-[60vh] w-full">
              {/* Left side column with time labels */}
              <div className="absolute left-[-47px] select-none"> {/* Modified: First column for hours */}
                {hours.map(hour => (
                  <div key={hour} className="h-[4vh] border-b text-sm text-gray-700 flex items-center justify-end pr-2">
                    {format(new Date(2024, 1, 1, hour, 0), 'HH:mm')}
                  </div>
                ))}
              </div>

              {days.map(day => (
                <div key={day.toString()} className="col-span-1 relative border-l border-gray-200"> {/* Modified: Grid for each day */}                  
                  <h2 className="text-center text-lg font-semibold py-2 border-b sticky top-0">
                    {dateInDutch(day)}
                  </h2>
                  <div 
                    className={`relative grid h-full`}
                    style={{
                      gridTemplateRows: `repeat(${totalHours * 2}, minmax(0, 50px))`,
                    }}
                  > {/* Modified: 24 rows for 24 hours */}                    
                    {events
                      .filter(event => isSameDay(new Date(event.startTime), day))
                      .map(event => {
                        const eventStart = new Date(event.startTime);
                        const eventEnd = new Date(event.endTime);
                        const rowStart = calculateRowPosition(event.title, eventStart);
                        const rowEnd = calculateRowPosition(event.title, eventEnd, true);

                        return (
                          <div                             
                            key={event.id}
                            className={`bg-blue-100 hover:bg-blue-200 rounded-lg p-2 shadow-md overflow-hidden`}
                            style={{
                              gridRowStart: rowStart,
                              gridRowEnd: rowEnd
                            }}

                          >
                          <a
                            href={event.htmlLink || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black "
                          >
                            <p className="font-bold">{event.title}</p>
                            <p className="text-sm">
                              {format(new Date(event.startTime), 'p')} -{' '}
                              {format(new Date(event.endTime), 'p')}
                            </p>
                            <p className="text-xs text-gray-600 truncate">{event.description}</p>
                          </a>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
