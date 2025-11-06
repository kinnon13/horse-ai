interface VerificationEmailProps {
  recipientName: string
  horseName?: string
  horseBreed?: string
  horseAge?: string
  verificationToken: string
  verificationUrl: string
}

export function generateVerificationEmail(props: VerificationEmailProps): string {
  const { recipientName, horseName, horseBreed, horseAge, verificationUrl } = props

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Horse Information</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🐴 HorseGPT
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Hi ${recipientName},
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                We're building the most comprehensive equine database and have you listed as the owner of:
              </p>

              ${horseName ? `
              <table style="width: 100%; background-color: #f7fafc; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 600; color: #2d3748; margin-bottom: 8px;">
                      🐎 ${horseName}
                    </div>
                    ${horseBreed ? `<div style="color: #718096; font-size: 14px; margin-bottom: 4px;">Breed: ${horseBreed}</div>` : ''}
                    ${horseAge ? `<div style="color: #718096; font-size: 14px;">Age: ${horseAge}</div>` : ''}
                  </td>
                </tr>
              </table>
              ` : ''}

              <p style="margin: 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                Can you confirm this information is accurate? It only takes 30 seconds.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 30px 0;">
                <tr>
                  <td>
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      Verify My Horse Info →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
                <br>
                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                Thanks for helping us build the most accurate equine database!
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                HorseGPT Team<br>
                <a href="https://horsegpt.ai" style="color: #667eea; text-decoration: none;">horsegpt.ai</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer Note -->
        <p style="margin: 20px 0 0; color: #a0aec0; font-size: 12px; text-align: center;">
          This link will expire in 7 days for security reasons.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function generateVerificationSubject(horseName?: string): string {
  if (horseName) {
    return `Verify your horse ${horseName}'s information`
  }
  return 'Verify your horse information in our database'
}


