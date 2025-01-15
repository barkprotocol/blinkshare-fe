import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Define a schema for input validation
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  text: z.string().min(1).max(5000),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const { to, subject, text } = emailSchema.parse(body)

    // Check if all required environment variables are set
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing environment variable: ${envVar}`)
      }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    })

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }

    if (error instanceof Error && error.message.startsWith('Missing environment variable')) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Define a schema for input validation
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  text: z.string().min(1).max(5000),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const { to, subject, text } = emailSchema.parse(body)

    // Check if all required environment variables are set
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing environment variable: ${envVar}`)
      }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    })

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }

    if (error instanceof Error && error.message.startsWith('Missing environment variable')) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

