import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

// Load the service account JSON key
const serviceAccountKeyPath = path.join(process.cwd(), '../credentials/lofty-hall-408121-2005aeca97fd.json');
const serviceAccountKey = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));

// Create JWT client using the service account key
const createServiceAccountClient = (): JWT => {
  return new google.auth.JWT({
    email: serviceAccountKey.client_email,
    key: serviceAccountKey.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar'],
  });
};

// Create Calendar client using the JWT client
const createCalendarClient = (auth: JWT): calendar_v3.Calendar => {
  return google.calendar({ version: 'v3', auth });
};

// List all accessible calendars
export const listCalendars = async (): Promise<calendar_v3.Schema$CalendarListEntry[]> => {
  console.log(`serviceAccountKey: ${serviceAccountKey}`);
  const auth = createServiceAccountClient();
  const calendar = createCalendarClient(auth);

  try {
    const response = await calendar.calendarList.list({
      maxResults: 5,
      showHidden: true,
    });

    console.log('Calendars:', response.data.items);
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendars:', error);
    throw error;
  }
};

// List events from a specific calendar
export const listEvents = async (
  timeMin: string = new Date().toISOString(),
  timeMax: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default: 30 days from now
): Promise<calendar_v3.Schema$Event[]> => {
  const auth = createServiceAccountClient();
  const calendar = createCalendarClient(auth);

  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,  // Replace with your fixed calendar ID
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Events:', response.data.items);
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
