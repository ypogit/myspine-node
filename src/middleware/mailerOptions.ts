import nodemailer from 'nodemailer'

type MailOptions = {
  to: string,
  from?: string,
  subject?: string,
  html?: string
}
type MailContent = {
  [key: string]: Partial<MailOptions>
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  }
})

export const requestMail = async({ to, mailType, url }: { 
  to: string, 
  mailType: 'reset_pass_requested' | 'reset_pass_completed', 
  url?: string 
}) => {

  const mailContent: MailContent = {
    reset_pass_requested: {
      subject: "Password reset",
      html: `<h1>Peace of Mind SPINE.com</h1><p>Please click on the following link <a href=${url}>${url}</a> to reset your password</p>`,
    },
    reset_pass_completed: {
      subject: "Successfully reset password",
      html: `<h1>Peace of Mind SPINE.com</h1><p>You have successfully reset your password</p>`
    }
  }

  const mailOptions: MailOptions = {
    from: `Peace of Mind Spine <${process.env.MAILER_EMAIL}>`,
    to,
    ...mailContent[mailType]
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new Error(err.message)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}