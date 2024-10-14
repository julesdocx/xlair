import { google, calendar_v3, Auth } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar'];
// const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;

const createJwtClient = () => new Auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const createCalendarClient = (auth: Auth.JWT) => google.calendar({
  version: 'v3',
  auth,
});

export const listCalendars = async () => {
  const jwtClient = createJwtClient();
  const calendar = createCalendarClient(jwtClient);

  try {
    console.log("listCalendars");
    const response = await calendar.calendarList.list({
      maxResults: 5,
      showHidden: true
    });

    console.log(response);

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendars: ', error);
    throw error;
  }
}

export const listEvents = async (
  timeMin: string = new Date().toISOString(),
  timeMax: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
): Promise<calendar_v3.Schema$Event[]> => {
  const jwtClient = createJwtClient();
  const calendar = createCalendarClient(jwtClient);

  try {
    console.log(process.env.GOOGLE_CALENDAR_ID);
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log(response);

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};