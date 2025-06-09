import { Distances, Checkpoint } from "@/types"

export const validateMinAndMax = (min: number, max: number): string => {
  if (!(Number.isInteger(min) && Number.isInteger(max))) {
    return "Syöte on oltava kokonaisluku."
  }

  if (min > max) {
    return "Minimiaika ei voi olla suurempi kuin maksimiaika."
  }

  if (min < 0 || max < 0) {
    return "Ajat eivät voi olla negatiivisia."
  }
  return ""
}

export const validateCheckpointDistances = (distances: Distances, checkpoints: Checkpoint[]): boolean => {
  try {
    if (Object.keys(distances).length === 0) {
      return false
    }
    for (let i = 0; i < checkpoints.length; i++) {
      for (let j = 0; j < checkpoints.length; j++) {
        if (i !== j && checkpoints[i].type !== "FINISH" && checkpoints[j].type !== "START" && !(checkpoints[i].type === "START" && checkpoints[j].type === "FINISH")) {
          const fromId = checkpoints[i].id
          const toId = checkpoints[j].id
          if (!(Number.isInteger(distances[fromId][toId]))) {
            return false
          }
        }
      }
    }
    return true
  } catch {
    return false
  }
}
