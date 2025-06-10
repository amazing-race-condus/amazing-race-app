import { Event, Group } from "@/types"
import { getPenaltyMinutes } from "./groupUtils"

export const getRaceTime = (group: Group, event: Event) => {
  let raceTime: string | null = null
  const totalPenalty = getPenaltyMinutes(group)

  if (event.startTime) {
    const startTime = new Date(event.startTime)
    let totalMinutes: number
    if (!group.finishTime) {
      const now = new Date
      totalMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60)) + totalPenalty
    } else {
      const finishTime = new Date(group.finishTime)
      totalMinutes = Math.floor((finishTime.getTime() - startTime.getTime()) / (1000 * 60)) + totalPenalty
    }
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    raceTime = `${hours}:${minutes.toString().padStart(2, "0")}`
  }

  return raceTime
}