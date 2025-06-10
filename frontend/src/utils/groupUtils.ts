import { Event, Group } from "@/types"
import { getRaceTime } from "./timeUtils"

export const getPenaltyMinutes = (group: Group) =>
  (group?.penalty?.reduce((total, penalty) => total + penalty.time, 0) || 0)

export const sortAlphabetically = (groups: Group[]) => groups.sort((a, b) => a.name.localeCompare(b.name))

export const sortByTime = (groups: Group[], event: Event) => {
  if (event.startTime) {
    return groups.sort((a, b) => getRaceTime(a, event)!.localeCompare(getRaceTime(b, event)!))
  } else {
    return groups.sort((a, b) => getPenaltyMinutes(a) - getPenaltyMinutes(b))
  }
}

export const sortByStatus = (groups: Group[]) => {
  return groups.sort((a, b) => {
    const getStatus = (group: Group): number => {
      if (group.disqualified) return 1
      if (group.dnf) return 2
      return 0
    }

    const statusA = getStatus(a)
    const statusB = getStatus(b)

    if (statusA !== statusB) {
      return statusA - statusB
    }

    return a.name.localeCompare(b.name)
  })
}