import nodemailer from "nodemailer"
import { Email } from "@/types"

export const Mailer = async (message: Email): Promise<void> => {

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPW
    },
    ...(process.env.NODE_ENV !== "production" && {
      tls: {
        rejectUnauthorized: false
      }
    })
  })
  await transport.sendMail(message)
}

