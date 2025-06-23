import nodemailer from "nodemailer"
import { Email } from "@/types"

export const Mailer = async (message: Email): Promise<void> => {

  const transport = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPW,
    },
    tls: {
      servername: "smtp.gmail.com",
    },
  })
  await transport.sendMail(message)
}

