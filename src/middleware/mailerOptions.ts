import nodemailer from 'nodemailer'

type MailOptions = {
  mailType: string,
  to: string,
  from: string,
  subject: string,
  url?: string,
  html?: string,
  content?: string
}

type MailContent = {
  [key: string]: Partial<MailOptions>
}

// TODO: Change SMTP connection provider
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  }
})

export const requestMail = async({ mailType, to, from, url, content }: {
  mailType: 'reset_pass_requested' | 'reset_pass_completed' | 'appointment_requested',
  to?: string,
  from?: string,
  url?: string,
  content?: string
}) => {
  const mailContent: MailContent = {
    reset_pass_requested: {
      from: `Peace of Mind Spine <${process.env.MAILER_EMAIL}>`,
      to,
      subject: "Password reset",
      html: `You have requested a password reset for <a href="https://peaceofmindspine.com"}>peaceofmindspine.com</a> <p>Please click on the following link <a href=${url}>${url}</a> to reset your password.</p>`,
    },
    reset_pass_completed: {
      from: `Peace of Mind Spine <${process.env.MAILER_EMAIL}>`,
      to,
      subject: "Successfully reset password",
      html: `<p>Done! You have successfully reset your password for <a href="https://peaceofmindspine.com"}>peaceofmindspine.com</a></p>`
    },
    appointment_requested: {
      from,
      to: process.env.MAILER_EMAIL,
      subject: "Request for Appointment",
      html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Title</title>
          </head>
          <body>${content}</body>
        </html>`
    }
  }

  transporter.sendMail(mailContent[mailType], (err, info) => {
    if (err) {
      throw new Error(err.message)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}