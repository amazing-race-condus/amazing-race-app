import { render, fireEvent, act, screen } from "@testing-library/react-native"
import GroupCheckpointActions from "../GroupCheckpointActions"
import { Provider } from "react-redux"
import { group, checkpoint, startCheckpoint, createMockStore } from "@/utils/testUtils"

describe("<GroupCheckpointActions />", () => {
  let store: any
  let mockCompleteCheckpoint: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
    mockCompleteCheckpoint = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})