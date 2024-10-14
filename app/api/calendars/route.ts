import { NextResponse } from 'next/server';
import { listCalendars } from '@/app/services/CalendarService';

export async function GET() {

  try {
    const calendars = await listCalendars();
    console.log(calendars);
    return NextResponse.json(calendars);
  } catch (error) {
    console.error('Error in calendar API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
