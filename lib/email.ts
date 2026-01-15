import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'isabella.taneja@commure.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'Commure Access <no-reply@commure.com>'

export async function sendAdminNewUserEmail(user: { name?: string | null; email?: string | null }) {
  const name = user.name || 'New User'
  const email = user.email || 'Unknown email'

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New User Signup: ${name}`,
    text: `A new user signed in and is pending approval.\n\nName: ${name}\nEmail: ${email}\n\nThey are waiting for access approval.`,
  })
}
