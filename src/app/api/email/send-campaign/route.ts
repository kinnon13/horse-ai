import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email/client'
import { generateVerificationEmail, generateVerificationSubject } from '@/lib/email/templates/verificationEmail'
import { generateBusinessVerificationEmail, generateBusinessVerificationSubject } from '@/lib/email/templates/businessVerificationEmail'
import { createVerificationToken, generateVerificationUrl } from '@/lib/email/tokens'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignType, targetType, limit = 10 } = body

    // Validation
    if (!campaignType || !targetType) {
      return NextResponse.json({ error: 'Missing campaign parameters' }, { status: 400 })
    }

    let recipients: any[] = []
    let emailsSent = 0
    let emailsFailed = 0

    // Fetch recipients based on target type
    if (targetType === 'users') {
      const { data: users } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('email_verified', false)
        .limit(limit)

      recipients = users || []
    } else if (targetType === 'businesses') {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, business_name, contact_email, business_type, city, state')
        .eq('verified', false)
        .limit(limit)

      recipients = businesses || []
    }

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        // Generate token
        const { token } = await createVerificationToken({
          email: targetType === 'users' ? recipient.email : recipient.contact_email,
          userId: targetType === 'users' ? recipient.id : undefined,
          businessId: targetType === 'businesses' ? recipient.id : undefined,
          type: targetType === 'users' ? 'user' : 'business',
          expiresInDays: 7
        })

        const verificationUrl = generateVerificationUrl(token, targetType === 'users' ? 'user' : 'business')

        let html: string
        let subject: string

        if (targetType === 'users') {
          html = generateVerificationEmail({
            recipientName: recipient.full_name || 'Horse Owner',
            verificationToken: token,
            verificationUrl
          })
          subject = generateVerificationSubject()
        } else {
          html = generateBusinessVerificationEmail({
            businessName: recipient.business_name,
            verificationToken: token,
            verificationUrl,
            businessType: recipient.business_type,
            location: recipient.city && recipient.state ? `${recipient.city}, ${recipient.state}` : undefined
          })
          subject = generateBusinessVerificationSubject(recipient.business_name)
        }

        // Send email
        const result = await sendEmail({
          to: targetType === 'users' ? recipient.email : recipient.contact_email,
          subject,
          html,
          tags: [
            { name: 'type', value: targetType },
            { name: 'campaign', value: campaignType }
          ]
        })

        if (result.success) {
          emailsSent++
        } else {
          emailsFailed++
          console.error(`Failed to send to ${targetType === 'users' ? recipient.email : recipient.contact_email}`)
        }

        // Rate limiting: wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (err) {
        emailsFailed++
        console.error('Individual email error:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Campaign sent to ${recipients.length} recipients`,
      stats: {
        total: recipients.length,
        sent: emailsSent,
        failed: emailsFailed
      }
    })
  } catch (err) {
    console.error('Send campaign error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}


