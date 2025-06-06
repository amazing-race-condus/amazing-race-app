import { render, screen } from "@testing-library/react-native"
import GroupList from "../GroupList"
import { Provider } from "react-redux"
import { group, dnfGroup, disqualifiedGroup, createMockStore } from "@/utils/testUtils"

describe("<GroupList />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("list renders group names", () => {
    const groups = [group, dnfGroup, disqualifiedGroup]

    render(
      <Provider store={store}>
        <GroupList groups={groups} />
      </Provider>
    )

    const groupName = screen.getByText(group.name)
    const dnfName = screen.getByText(dnfGroup.name)
    const disqName = screen.getByText(disqualifiedGroup.name)
    expect(groupName).toBeTruthy()
    expect(dnfName).toBeTruthy()
    expect(disqName).toBeTruthy()
  })
})