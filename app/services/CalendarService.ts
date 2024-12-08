import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
// import fs, { readFileSync } from 'fs';
// import path from 'path';
// import { CLIENT_PUBLIC_FILES_PATH } from 'next/dist/shared/lib/constants';
//import { cloudbilling } from 'googleapis/build/src/apis/cloudbilling';

// Load the service account JSON key
//const serviceAccountKeyPath = path.join(process.cwd(), '../../credentials/lofty-hall-408121-2005aeca97fd.json');
//const serviceAccountKey = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));

const client_email = process.env.GOOGLE_CLIENT_EMAIL
const private_key = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined

// Create JWT client using the service account key
const createServiceAccountClient = (): JWT => {
  const jwtClient = new google.auth.JWT({
    email: client_email,
    key: private_key,
    //keyFile: serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar'],
  });

  jwtClient.authorize((err) => {
    if (err) console.log(err);
  });
  jwtClient.getRequestHeaders().then((auth) => {
    console.log(auth);
  });
  console.log(JSON.stringify(jwtClient))
  return jwtClient;

};

// Create Calendar client using the JWT client
const createCalendarClient = (auth: JWT): calendar_v3.Calendar => {
  // console.log(`createCalendarClient; JWT: ${JSON.stringify(auth, null, 2)}`)
  return google.calendar({ version: 'v3', auth });
};

// List all accessible calendars
export const listCalendars = async (): Promise<calendar_v3.Schema$CalendarListEntry[]> => {
  //console.log(`serviceAccountKey: ${serviceAccountKey}`);
  // console.log(`client_email: ${client_email}\nprivate_key: ${private_key}`)
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
  console.log("CalendarService: listEvents before 'auth' and 'calendar' clients")
  console.log(`client_email: ${client_email}\nprivate_key: ${private_key}`)
  const auth = createServiceAccountClient();
  const calendar = createCalendarClient(auth);

  try {
    console.log("CalendarService: listEvents")
    // console.log(`auth: ${JSON.stringify(auth, null, 2)}\ncalendar: ${JSON.stringify(calendar, null, 2)}`)
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
