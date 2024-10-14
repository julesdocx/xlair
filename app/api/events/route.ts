import { NextResponse } from 'next/server';
import { listEvents } from '@/app/services/CalendarService';

export async function GET() {
  try {
    const events = await listEvents();  // You can also pass timeMin and timeMax as query params if needed
    console.log("Events:", events);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in events API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
