import { NextResponse } from 'next/server'; // Use NextResponse instead of NextApiResponse
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh Token:', tokens.refresh_token);
    
    // In a real application, you'd securely store this refresh token
    // For now, we'll just display it (not recommended for production)
    return new NextResponse(`
      <html>
        <body>
          <h1>Authentication successful!</h1>
          <p>Refresh Token: ${tokens.refresh_token}</p>
          <p>Please save this refresh token securely and add it to your environment variables.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
  });
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ error: 'Failed to get tokens' }, { status: 500 });
  }
}