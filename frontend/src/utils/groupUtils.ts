import { Event, Group } from "@/types"
import { getRaceTime } from "./timeUtils"

export const getPenaltyMinutes = (group: Group) =>
  (group?.penalty?.reduce((total, penalty) => total + penalty.time, 0) || 0)

export const sortAlphabetically = (groups: Group[]) => groups.sort((a, b) => a.name.localeCompare(b.name))

export const sortByTime = (groups: Group[], event: Event) => {
  const getStatus = (group: Group): number => {
    if (group.disqualified) return 3
    if (group.dnf) return 2
    if (group.nextCheckpointId && group.route) {
      if (group.nextCheckpointId === group.route[0].id) return 1
    }
    return 0
  }

  if (event.startTime) {
    return groups.sort((a, b) => {
      const statusA = getStatus(a)
      const statusB = getStatus(b)

      if (statusA !== statusB) {
        return statusA - statusB
      }

      return getRaceTime(a, event)! - (getRaceTime(b, event)!)
    })
  } else {
    return groups.sort((a, b) => getPenaltyMinutes(a) - getPenaltyMinutes(b))
  }
}

export const sortByStatus = (groups: Group[]) => {
  return groups.sort((a, b) => {
    const getStatus = (group: Group): number => {
      if (group.disqualified) return 1
      if (group.nextCheckpointId && group.route) {
        if (group.nextCheckpointId === group.route[0].id) return 2
      }
      if (group.dnf) return 3
      if (!group.finishTime) return 4
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

export const getProgress = (group: Group) => {
  //returns how many checkpoint the group has visited, including start and finish

  if (!group.route)
    return null
  if (group.route.length === 0)
    return null
  if (group.nextCheckpointId === null && !group.finishTime)
    return null
  if (group.nextCheckpointId === null && group.finishTime)
    return group.route.length

  const routeCheckpointIds = group.route.map(route => route.id)

  return routeCheckpointIds.indexOf(Number(group.nextCheckpointId))
}
