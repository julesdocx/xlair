import { CalendarEvent } from "./types";
import { calendar_v3 } from 'googleapis';

const isCalendarEvent = (x:unknown): x is CalendarEvent => {
  if (typeof x === 'object' && x !== null) {
    const obj = x as Partial<CalendarEvent>;  
    return typeof obj.id === 'string' && 
    typeof obj.title === 'string' &&
    typeof obj.startTime === 'string' && 
    typeof obj.endTime === 'string';
  }
  return false;
};

export const formatEvents = (events: calendar_v3.Schema$Event[]): CalendarEvent[] => {
  const formattedEvents: CalendarEvent[] = events.map(event => {
    if (event.id && event.summary && event.start?.dateTime && event.end?.dateTime) {
      const calendarEvent: CalendarEvent = {
        id: event.id,
        title: event.summary,  // Fallback if the event has no title
        description: event.description || null,  // Fallback if no description is available
        startTime: event.start?.dateTime ,  // Can handle both dateTime and date
        endTime: event.end?.dateTime,
        htmlLink: event.htmlLink || null,  // Link to the event in Google Calendar
      };
      return calendarEvent;
    };
    return undefined;
  }).filter(isCalendarEvent);

  return formattedEvents;
};