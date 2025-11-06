interface BusinessVerificationEmailProps {
  businessName: string
  contactName?: string
  verificationToken: string
  verificationUrl: string
  businessType?: string
  location?: string
}

export function generateBusinessVerificationEmail(props: BusinessVerificationEmailProps): string {
  const { businessName, contactName, verificationUrl, businessType, location } = props

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim Your Business on HorseGPT</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🏆 Your Business is Listed on HorseGPT
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                ${contactName ? `Hi ${contactName},` : 'Hello,'}
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Great news! Your business is already listed in our equine directory:
              </p>

              <table style="width: 100%; background-color: #f0fff4; border-left: 4px solid #48bb78; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 600; color: #2d3748; margin-bottom: 8px;">
                      🏢 ${businessName}
                    </div>
                    ${businessType ? `<div style="color: #718096; font-size: 14px; margin-bottom: 4px;">${businessType}</div>` : ''}
                    ${location ? `<div style="color: #718096; font-size: 14px;">📍 ${location}</div>` : ''}
                  </td>
                </tr>
              </table>

              <h3 style="margin: 30px 0 15px; color: #2d3748; font-size: 18px; font-weight: 600;">
                Why verify your business?
              </h3>

              <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 16px; line-height: 1.8;">
                <li><strong>Get found:</strong> Show up when people search for ${businessType || 'equine services'}</li>
                <li><strong>Rank higher:</strong> Verified businesses rank above unverified ones</li>
                <li><strong>See analytics:</strong> Track how many people view your listing</li>
                <li><strong>Upload CRM:</strong> Find out which customers are already HorseGPT users</li>
              </ul>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0;">
                <tr>
                  <td>
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(72, 187, 120, 0.3);">
                      Verify & Claim My Business →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
                <br>
                <a href="${verificationUrl}" style="color: #48bb78; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                Join thousands of equine businesses on HorseGPT
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                HorseGPT Business Team<br>
                <a href="https://horsegpt.ai/business" style="color: #48bb78; text-decoration: none;">horsegpt.ai/business</a>
              </p>
            </td>
          </tr>

        </table>

        <p style="margin: 20px 0 0; color: #a0aec0; font-size: 12px; text-align: center;">
          This verification link will expire in 7 days.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function generateBusinessVerificationSubject(businessName: string): string {
  return `${businessName} is listed on HorseGPT - Claim your business`
}


