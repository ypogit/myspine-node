import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  }
})

export const emailPasswordReset = async(to: string, resetURL: string) => {
  const resetPasswordMailOptions = {
    from: `PeaceOfMindSPINE.com <${process.env.MAILER_EMAIL}>`,
    subject: "Password reset",
    html: `<h1>Peace of Mind SPINE.com</h1><p>Please click on the following link <a href=${resetURL}>${resetURL}</a> to reset your password</p>`
  }

  const mailOptions = { ...resetPasswordMailOptions, to }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new Error(err.message)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}