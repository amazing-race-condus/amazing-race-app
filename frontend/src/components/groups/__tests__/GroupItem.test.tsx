import { render, fireEvent, act, screen } from "@testing-library/react-native"
import GroupItem from "../GroupItem"
import { Provider } from "react-redux"
import { group, createMockStore } from "@/utils/testUtils"
import { usePathname } from "expo-router"
import * as alertUtils from "@/utils/handleAlert"

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  usePathname: jest.fn()
}))

describe("<GroupItem />", () => {
  let store: any

  beforeEach(() => {
    store = createMockStore({})
    store.dispatch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders name and remove button in settings view", () => {
    (usePathname as jest.Mock).mockReturnValue("/settings/groups")

    render(
      <Provider store={store}>
        <GroupItem
          group={group}
        />
      </Provider>
    )

    const groupName = screen.getByText(group.name)
    const removeButton = screen.getByText("Poista")
    expect(groupName).toBeTruthy()
    expect(removeButton).toBeTruthy()
  })

  test("renders name only in standard view", () => {
    (usePathname as jest.Mock).mockReturnValue("/")

    render(
      <Provider store={store}>
        <GroupItem
          group={group}
        />
      </Provider>
    )

    const groupName = screen.getByText(group.name)
    const removeButton = screen.queryByText("Poista")
    expect(groupName).toBeTruthy()
    expect(removeButton).toBeFalsy()
  })

  test("pressing remove button calls handleRemoveGroup in settings view", async () => {
    (usePathname as jest.Mock).mockReturnValue("/settings/groups")
    const handleAlertMock = jest.spyOn(alertUtils, "handleAlert").mockImplementation(() => {})

    render(
      <Provider store={store}>
        <GroupItem
          group={group}
        />
      </Provider>
    )

    const removeButton = screen.getByText("Poista")
    await act(async () => {
      fireEvent.press(removeButton)
    })

    expect(handleAlertMock).toHaveBeenCalledTimes(1)
  })
})