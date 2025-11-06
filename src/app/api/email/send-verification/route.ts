import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/client'
import { generateVerificationEmail, generateVerificationSubject } from '@/lib/email/templates/verificationEmail'
import { generateBusinessVerificationEmail, generateBusinessVerificationSubject } from '@/lib/email/templates/businessVerificationEmail'
import { createVerificationToken, generateVerificationUrl } from '@/lib/email/tokens'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, name, userId, businessId, horseName, horseBreed, horseAge, businessName, businessType, location } = body

    // Validation
    if (!type || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (type !== 'user' && type !== 'business') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    // Generate verification token
    const { token, error: tokenError } = await createVerificationToken({
      email,
      userId,
      businessId,
      type,
      expiresInDays: 7
    })

    if (tokenError) {
      return NextResponse.json({ error: `Token error: ${tokenError}` }, { status: 500 })
    }

    // Generate verification URL
    const verificationUrl = generateVerificationUrl(token, type)

    // Generate email content
    let html: string
    let subject: string

    if (type === 'user') {
      html = generateVerificationEmail({
        recipientName: name || 'Horse Owner',
        horseName,
        horseBreed,
        horseAge,
        verificationToken: token,
        verificationUrl
      })
      subject = generateVerificationSubject(horseName)
    } else {
      html = generateBusinessVerificationEmail({
        businessName: businessName || 'Your Business',
        contactName: name,
        verificationToken: token,
        verificationUrl,
        businessType,
        location
      })
      subject = generateBusinessVerificationSubject(businessName || 'Your Business')
    }

    // Send email
    const result = await sendEmail({
      to: email,
      subject,
      html,
      tags: [
        { name: 'type', value: type },
        { name: 'campaign', value: 'verification' }
      ]
    })

    if (!result.success) {
      return NextResponse.json({ error: `Email error: ${result.error}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
      token, // Return token for testing (remove in production)
      verificationUrl // Return URL for testing (remove in production)
    })
  } catch (err) {
    console.error('Send verification email error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}


