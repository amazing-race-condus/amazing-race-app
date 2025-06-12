import { Event, Group } from "@/types"
import { getPenaltyMinutes } from "./groupUtils"

export const getRaceTime = (group: Group, event: Event) => {
  let totalMinutes: number | null = null
  const totalPenalty = getPenaltyMinutes(group)

  if (!event) return totalMinutes

  if (event.startTime) {
    const startTime = new Date(event.startTime)
    if (!group.finishTime) {
      const now = new Date
      totalMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60)) + totalPenalty
    } else {
      const finishTime = new Date(group.finishTime)
      totalMinutes = Math.floor((finishTime.getTime() - startTime.getTime()) / (1000 * 60)) + totalPenalty
    }
    return totalMinutes
  }
  return totalMinutes
}