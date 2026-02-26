import { NextResponse } from 'next/server'
import { createTransport } from 'nodemailer'
export async function POST(request: Request) {
  const body = await request.json()
  const message = {
    from: 'Devflow@project.dev',
    to: body.email,
    subject: body.subject,
    html: body.html,

    headers: {
      'X-Entity-Ref-ID': 'newmail'
    }
  }

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  try {
    await transporter.sendMail(message)
    return NextResponse.json({ message: 'Email Sent Successfully' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
