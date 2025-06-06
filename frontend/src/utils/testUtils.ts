import type { Group, Checkpoint } from "@/types"
import configureStore from "redux-mock-store"

export const checkpoint: Checkpoint = {
  id: 436780235746,
  name: "Whatever",
  type: "INTERMEDIATE",
  eventId: 1,
  hint: null,
  easyHint: null
}

export const listCheckpoints: Checkpoint[] = [
  {
    id: 436780235746,
    name: "Oodi",
    type: "INTERMEDIATE",
    eventId: 1,
    hint: null,
    easyHint: null
  },
  {
    id: 2937418,
    name: "Kumpula",
    type: "INTERMEDIATE",
    eventId: 1,
    hint: null,
    easyHint: null
  },
  {
    id: 123987123,
    name: "Kalasatama",
    type: "FINISH",
    eventId: 1,
    hint: null,
    easyHint: null
  },
  {
    id: 123987123,
    name: "Saharan aavikko",
    type: "START",
    eventId: 1,
    hint: null,
    easyHint: null
  },
  {
    id: 123987123,
    name: "Mongolian erämää",
    type: "INTERMEDIATE",
    eventId: 1,
    hint: null,
    easyHint: null
  }
]

export const group: Group = {
  name: "Testers",
  id: 1010353225246231,
  members: 5,
  disqualified: false,
  dnf: false,
  penalty: [],
  easy: false,
  eventId: 1,
  nextCheckpointId: 436780235746,
  route: [checkpoint],
  finishTime: null
}

export const disqualifiedGroup: Group = {
  name: "Disqualified",
  id: 1,
  members: 5,
  disqualified: true,
  dnf: false,
  penalty: [],
  easy: false,
  eventId: 1,
  nextCheckpointId: 436780235746,
  route: [checkpoint],
  finishTime: null
}

export const dnfGroup: Group = {
  name: "Disqualified",
  id: 1,
  members: 5,
  disqualified: false,
  dnf: true,
  penalty: [],
  easy: false,
  eventId: 1,
  nextCheckpointId: 436780235746,
  route: [checkpoint],
  finishTime: null
}

export const mockStore = configureStore([])

export const reanimatedMock = jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock")

  Reanimated.default.call = () => {}
  Reanimated.useReducedMotion = () => false

  return Reanimated
})

