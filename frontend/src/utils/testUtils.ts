import type { Group, Checkpoint } from "@/types"
// import configureStore from "redux-mock-store"
import { configureStore } from "@reduxjs/toolkit"
import eventSlice from "@/reducers/eventSlice"
import notificationSlice from "@/reducers/notificationSlice"
import groupSlice from "@/reducers/groupSlice"

export const checkpoint: Checkpoint = {
  id: 436780235746,
  name: "Whatever",
  type: "INTERMEDIATE",
  eventId: 1,
  hint: null,
  easyHint: null
}

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

export const createMockStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      groups: groupSlice,
      event: eventSlice,
      notification: notificationSlice
    },
    preloadedState
  })

export const reanimatedMock = jest.mock("react-native-reanimated", () => {
  const Reanimated = jest.requireActual("react-native-reanimated/mock")

  Reanimated.default.call = () => {}
  Reanimated.useReducedMotion = () => false

  return Reanimated
})

