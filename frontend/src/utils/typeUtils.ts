export const getType = (type?: string): string => {
  switch (type) {
  case "START":
    return "Lähtö"
  case "FINISH":
    return "Maali"
  default:
    return ""
  }
}