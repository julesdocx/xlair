// import { NextResponse } from 'next/server';
// import { listEvents } from '@/app/services/CalendarService';

// export async function GET() {
//   try {
//     const events = await listEvents();  // You can also pass timeMin and timeMax as query params if needed
//     return NextResponse.json(events);
//   } catch (error) {
//     console.error('Error in events API route:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { listEvents } from '@/app/services/CalendarService';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const timeMin = searchParams.get('timeMin') || new Date().toISOString();
  const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const events = await listEvents(timeMin, timeMax);
    console.log(events);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in calendar API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}