import { google, calendar_v3, Auth } from 'googleapis';

// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar'];

// Create OAuth2 client using the refresh token
const createOAuth2Client = () => {
  const oauth2Client = new Auth.OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  );

  // Set the refresh token
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
};

// Create Calendar client
const createCalendarClient = (auth: Auth.OAuth2Client) => google.calendar({
  version: 'v3',
  auth,
});

// List all accessible calendars
export const listCalendars = async (): Promise<calendar_v3.Schema$CalendarListEntry[]> => {
  const oauth2Client = createOAuth2Client();
  const calendar = createCalendarClient(oauth2Client);

  try {
    console.log("Fetching calendars...");
    const response = await calendar.calendarList.list({
      maxResults: 5,
      showHidden: true,
    });

    console.log(response.data.items);

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendars: ', error);
    throw error;
  }
};

// List events from a specific calendar
export const listEvents = async (
  timeMin: string = new Date().toISOString(),
  timeMax: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default: 30 days from now
): Promise<calendar_v3.Schema$Event[]> => {
  const oauth2Client = createOAuth2Client();
  const calendar = createCalendarClient(oauth2Client);

  try {
    console.log("Fetching events from calendar:", process.env.GOOGLE_CALENDAR_ID);
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,  // Make sure this ID is correct
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const logArray: { title: string | null | undefined; start: calendar_v3.Schema$EventDateTime | undefined; end: calendar_v3.Schema$EventDateTime | undefined; }[] | undefined = response.data.items?.map((item) => {
      return {
        title: item.summary,
        start: item.start,
        end: item.end
      };
    })
    console.log(logArray);

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};
