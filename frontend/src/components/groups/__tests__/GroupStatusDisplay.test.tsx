import { Provider } from "react-redux"
import { render, screen } from "@testing-library/react-native"
import GroupStatusDisplay from "../GroupStatusDisplay"
import { group, disqualifiedGroup, dnfGroup, mockStore } from "@/utils/testUtils"

describe("<GroupStatusDisplay />", () => {
  let store: any

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("group name is rendered", () => {
    render(
      <Provider store={store}>
        <GroupStatusDisplay group={ group } />
      </Provider>
    )

    const name = screen.getByText("Testers")
    expect(name.props.children).toBe("Testers")
  })

  test("disqualified group shows up as disqualified", () => {
    render(
      <Provider store={store}>
        <GroupStatusDisplay group={ disqualifiedGroup } />
      </Provider>
    )

    const disq = screen.getByText("DISKATTU")
    expect(disq).toBeTruthy()
  })

  test("dnf group shows up as dnf", () => {
    render(
      <Provider store={store}>
        <GroupStatusDisplay group={ dnfGroup } />
      </Provider>
    )

    const disq = screen.getByText("SUORITUS KESKEYTETTY")
    expect(disq).toBeTruthy()
  })
})