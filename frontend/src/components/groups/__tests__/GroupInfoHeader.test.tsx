import { render, screen } from "@testing-library/react-native"
import GroupInfoHeader from "../GroupInfoHeader"
import { Provider } from "react-redux"
import { createMockStore, group } from "@/utils/testUtils"

describe("<GroupInfoHeader />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders all info items", () => {
    render(
      <Provider store={store}>
        <GroupInfoHeader
          group={group}
          totalPenalty={35}
        />
      </Provider>
    )

    const items = []
    items.push(screen.getByText("Jäsenet"))
    items.push(screen.getByText("Aika"))
    items.push(screen.getByText("Rankut"))
    items.push(screen.getByText("Helpotettu"))

    for (const item of items) {
      expect(item).toBeTruthy()
    }
  })
})