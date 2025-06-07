import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json({ message: 'Resend API key not configured.' }, { status: 500 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Replace with your verified sender email from Resend
        to: 'mrdbortey@gmail.com',
        subject: 'New Inquiry from Landing Page',
        html: `<p>You have a new message from: <strong>${email}</strong></p><p>This is an automated notification.</p>`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ message: 'Email sent successfully!', data }, { status: 200 });
    } else {
      console.error('Resend API error:', data);
      return NextResponse.json({ message: `Failed to send email: ${data.message || 'Unknown error'}` }, { status: response.status });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
} 