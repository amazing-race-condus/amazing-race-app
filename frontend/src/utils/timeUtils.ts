import { Event, Group } from "@/types"
import { getPenaltyMinutes } from "./groupUtils"

export const getRaceTime = (group: Group, event: Event) => {
  let totalSeconds: number | null = null
  const totalPenalty = getPenaltyMinutes(group)

  if (!event) return totalSeconds

  if (event.startTime) {
    const startTime = new Date(event.startTime)
    if (!group.finishTime && !event.endTime) {
      const now = new Date
      totalSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000) + totalPenalty * 60
    } else {
      // finishTime is either group.finishTime or event.endTime, whichever exists and is earlier
      const finishTimeRaw = !group.finishTime
        ? event.endTime
        : !event.endTime
          ? group.finishTime
          : (group.finishTime < event.endTime ? group.finishTime : event.endTime)

      const finishTime = new Date(finishTimeRaw!)
      totalSeconds = Math.floor((finishTime!.getTime() - startTime.getTime()) / 1000) + totalPenalty * 60
    }
    return totalSeconds
  }
  return totalSeconds
}