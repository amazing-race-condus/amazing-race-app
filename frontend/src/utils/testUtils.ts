import type { Group, Checkpoint } from "@/types"
import configureStore from "redux-mock-store"

export const group: Group = {
  name: "Testers",
  id: 1010353225246231,
  members: 5,
  disqualified: false,
  dnf: false,
  penalty: []
}

export const checkpoint: Checkpoint = {
  id: 436780235746,
  name: "Whatever",
  type: "INTERMEDIATE",
  eventId: 1,
  hint: null
}

export const mockStore = configureStore([])
