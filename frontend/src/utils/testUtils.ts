import type { Group, Checkpoint, Penalty, Event } from "@/types"
// import configureStore from "redux-mock-store"
import { configureStore } from "@reduxjs/toolkit"
import eventSlice from "@/reducers/eventSlice"
import notificationSlice from "@/reducers/notificationSlice"
import groupSlice from "@/reducers/groupSlice"
import checkpointSlice from "@/reducers/checkpointsSlice"
import userSlice from "@/reducers/userSlice"

export const checkpoint: Checkpoint = {
  id: 436780235746,
  name: "Whatever",
  type: "INTERMEDIATE",
  eventId: 1,
  hint: "http://hint.com",
  easyHint: "http://easyhint.com"
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

export const startCheckpoint: Checkpoint = {
  id: 1,
  name: "Start checkpoint",
  type: "START",
  eventId: 1,
  hint: null,
  easyHint: null
}

export const finishCheckpoint: Checkpoint = {
  id: 2,
  name: "Finish checkpoint",
  type: "FINISH",
  eventId: 1,
  hint: null,
  easyHint: null
}

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
  name: "Diskattavat",
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
  name: "Kesken",
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

export const hintPenalties: Penalty[] = [
  {
    id: 1,
    type: "HINT",
    time: 5,
    groupId: 1,
    checkpointId: 1
  },
  {
    id: 2,
    type: "HINT",
    time: 5,
    groupId: 1,
    checkpointId: 1
  }
]

export const skipPenalties: Penalty[] = [
  {
    id: 1,
    type: "SKIP",
    time: 5,
    groupId: 1,
    checkpointId: 1
  },
]

export const overtimePenalties: Penalty[] = [
  {
    id: 1,
    type: "OVERTIME",
    time: 5,
    groupId: 1,
    checkpointId: 1
  },
]

export const events: Event[] = [
  {
    id: 1,
    name: "MockEvent",
    startTime: null,
    endTime: null,
    minRouteTime: null,
    maxRouteTime: null,
    eventDate: new Date("2025-06-25 21:00:00"),
    group: [],
    checkpoints: [],
    penalties: []
  }
]

export const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      groups: groupSlice,
      event: eventSlice,
      notification: notificationSlice,
      checkpoints: checkpointSlice,
      user: userSlice
    },
    preloadedState
  })

export const reanimatedMock = jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock")

  Reanimated.default.call = () => {}
  Reanimated.useReducedMotion = () => false

  return Reanimated
})

export const mockExpoRouter = jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  usePathname: jest.fn()
}))
