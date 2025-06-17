import { Response } from "express"


const validatePassword = (password: string, res: Response) : boolean => {

  if (password.length < 8){
    res.status(400).json({ error: "Salasanan tulee olla vähintään 8 merkkiä." })
    return false
  }
  if (!/[a-z]/.test(password)) {
    res.status(400).json({ error: "Salasanassa tulee olla ainakin yksi pieni kirjain." })
    return false
  }

  if (!/[A-Z]/.test(password)) {
    res.status(400).json({ error: "Salasanassa tulee olla ainakin yksi iso kirjain." })
    return false
  }
  if (!/[0-9]/.test(password)) {
    res.status(400).json({ error: "Salasanassa tulee olla ainakin yksi numero." })
    return false
  }
  return true
}

export { validatePassword }
