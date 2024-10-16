import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types';
import { formatEvents } from '../utils';
import { addDays, format, isSameDay, isAfter, startOfDay, getHours} from 'date-fns';

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
  // const earliestMinute = getMinutes(earliestStartTime);  // Get the minute of the earliest event

  // Helper to generate time labels for the left side
  const hours = Array.from({ length: 24 - earliestHour }, (_, i) => earliestHour + i); // Modified

  
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
            <div className="grid grid-cols-7 gap-4 h-[60vh] w-full">
              {/* Left side column with time labels */}
              <div className="hidden md:block">
                {hours.map(hour => (
                  <div key={hour} className="h-[4vh] border-b text-sm text-gray-700"> {/* Modified */}
                    {format(new Date(2022, 1, 1, hour, 0), 'h a')}
                  </div>
                ))}
              </div>

              {days.map(day => (
                <div key={day.toString()} className="relative border border-gray-200 rounded-lg w-full">
                  <h2 className="text-center text-lg font-semibold py-2 border-b">
                    {format(day, 'EEEE, MMMM d')}
                  </h2>
                  <div className="relative h-full">
                    {events
                      .filter(event => isSameDay(new Date(event.startTime), day))
                      .map(event => {
                        const eventStart = new Date(event.startTime);
                        const eventEnd = new Date(event.endTime);

                        // Calculate event top position based on start time (for a 24h timetable)
                        const startHours = eventStart.getHours() + eventStart.getMinutes() / 60;
                        const endHours = eventEnd.getHours() + eventEnd.getMinutes() / 60;
                        const top = ((startHours - earliestHour) / (24 - earliestHour)) * 100;  // Adjust based on earliest hour
                        const height = ((endHours - startHours) / (24 - earliestHour)) * 100;

                        return (
                          <a
                            key={event.id}
                            href={event.htmlLink || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black absolute left-0 right-0 bg-blue-100 hover:bg-blue-200 rounded-lg p-2 shadow-md overflow-hidden"
                            style={{
                              top: `${top}%`,
                              height: `${height}%`,
                            }}
                          >
                            <p className="font-bold">{event.title}</p>
                            <p className="text-sm">
                              {format(new Date(event.startTime), 'p')} -{' '}
                              {format(new Date(event.endTime), 'p')}
                            </p>
                            <p className="text-xs text-gray-600 truncate">{event.description}</p>
                          </a>
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
