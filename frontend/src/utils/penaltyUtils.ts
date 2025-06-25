import { Group } from "@/types"

export const getPenaltyMinutes = (group: Group) =>
  (group?.penalty?.reduce((total, penalty) => total + penalty.time, 0) || 0)
