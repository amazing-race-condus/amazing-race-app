import eventReducer, { getEventReducer, setStartReducer, setEndReducer, setEvents } from "../eventSlice"
import type { Event } from "@/types"
import { createMockStore } from "@/utils/testUtils"
import { getEvent, startGame, endGame } from "@/services/eventService"

jest.mock("@/utils/storageUtil", () => ({
  storageUtil: {
    setUser: jest.fn(),
    getUser: jest.fn(),
    removeUser: jest.fn(),
  },
}))

jest.mock("@/services/eventService", () => ({
  getEvent: jest.fn(),
  startGame: jest.fn(),
  endGame: jest.fn()
}))

describe("eventSlice reducers", () => {
  let store : ReturnType<typeof createMockStore>

  const initialState: Event = {
    id: 2,
    name: "Test Event",
    startTime: null,
    endTime: null,
    minRouteTime: null,
    maxRouteTime: null,
    eventDate: new Date()
  }

  beforeEach(() => {
    store = createMockStore({})
    jest.useFakeTimers()
  })

  test("should set event", () => {
    const firstEvent = {
      id: 2,
      name: "Test Event",
      startTime: null,
      endTime: null,
      minRouteTime: null,
      maxRouteTime: null,
      eventDate: new Date()
    }
    const state = eventReducer(initialState, setEvents(firstEvent))
    expect(state).toEqual(firstEvent)
  })

  const returnState = {
    id: 1,
    name: "Test Event3",
    startTime: null,
    endTime: null,
    group: [],
    checkpoints: [],
    routeLimits: [],
    minRouteTime: null,
    maxRouteTime: null,
    penalties: []
  }

  test("getEventReducer thunk works", async () => {
    (getEvent as jest.Mock).mockResolvedValue(returnState)
    await store.dispatch<any>(getEventReducer(1))
    expect(store.getState().event).toEqual(returnState)
  })

  test("startGameReducer thunk works", async () => {
    (startGame as jest.Mock).mockResolvedValue(returnState)
    await store.dispatch<any>(setStartReducer(1))
    expect(store.getState().event).toEqual(returnState)
  })

  test("endGameReducer thunk works", async () => {
    (endGame as jest.Mock).mockResolvedValue(returnState)
    await store.dispatch<any>(setEndReducer(1))
    expect(store.getState().event).toEqual(returnState)
  })

})