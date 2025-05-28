import { Checkpoint } from "@/types"

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

export const sortCheckpoints = (checkpoints: Checkpoint[]) => {
  const typeOrder = {
    START: 0,
    FINISH: 1,
    INTERMEDIATE: 2,
  }

  return [...checkpoints].sort((a, b) => {
    const orderA = typeOrder[a.type] ?? 3
    const orderB = typeOrder[b.type] ?? 3

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.name.localeCompare(b.name)
  })
}