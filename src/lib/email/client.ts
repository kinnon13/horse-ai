// Email client using Resend
// NOTE: Run `npm install resend` to enable email sending

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
}

/**
 * Send an email using Resend API
 * For production: Install resend package and add RESEND_API_KEY to .env
 */
export async function sendEmail(params: SendEmailParams) {
  const resendApiKey = process.env.RESEND_API_KEY

  // For MVP/development: log emails instead of sending
  if (!resendApiKey) {






    return { 
      success: true, 
      data: { 
        id: `dev-${Date.now()}`,
        mode: 'development'
      } 
    }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(resendApiKey)
    
    const result = await resend.emails.send({
      from: params.from || 'HorseGPT <noreply@horsegpt.ai>',
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
      tags: params.tags
    })

    return { 
      success: true, 
      data: result.data
    }
  } catch (error) {
    console.error('❌ Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

