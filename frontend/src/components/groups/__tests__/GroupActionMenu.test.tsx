import { reanimatedMock, group, disqualifiedGroup, dnfGroup, mockStore } from "@/utils/testUtils"
import { Provider } from "react-redux"
import { render, screen, act, fireEvent } from "@testing-library/react-native"
import GroupActionMenu from "../GroupActionMenu"
import testStore from "@/store/testStore"
import { Group } from "@/types"

const initialGroup = group

describe("<GroupActionMenu />", () => {
  let store: any
  let group: Group

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = jest.fn()
    group = { ...initialGroup }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("renders buttons", () => {
    const ref = {
      current: { close: null }
    }
    const store = testStore()
    const mockHandleDNF = jest.fn()
    const mockHandleDisqualification = jest.fn()

    render(
      <Provider store={store}>
        <GroupActionMenu
          group={group}
          ref={ref as any}
          handleDNF={mockHandleDNF as any}
          handleDisqualification={mockHandleDisqualification as any}
        />
      </Provider>
    )

    const dnf = screen.getByText("Keskeytä suoritus")
    const disq = screen.getByText("Diskaa ryhmä")
    expect(dnf).toBeTruthy()
    expect(disq).toBeTruthy()
  })

  test("pressing dnf button calls handleDNF", async () => {
    const ref = {
      current: { close: null }
    }
    const mockHandleDNF = jest.fn()
    const mockHandleDisqualification = jest.fn()

    render(
      <Provider store={store}>
        <GroupActionMenu
          group={group}
          ref={ref as any}
          handleDNF={mockHandleDNF as any}
          handleDisqualification={mockHandleDisqualification as any}
        />
      </Provider>
    )

    const dnfButton = screen.getByText("Keskeytä suoritus")
    await act(async () => {
      fireEvent.press(dnfButton)
    })

    expect(mockHandleDNF).toHaveBeenCalledTimes(1)
  })

  test("pressing disqualify button calls handleDisqualify", async () => {
    const ref = {
      current: { close: null }
    }
    const mockHandleDNF = jest.fn()
    const mockHandleDisqualification = jest.fn()

    render(
      <Provider store={store}>
        <GroupActionMenu
          group={group}
          ref={ref as any}
          handleDNF={mockHandleDNF as any}
          handleDisqualification={mockHandleDisqualification as any}
        />
      </Provider>
    )

    const disqualifyButton = screen.getByText("Diskaa ryhmä")
    await act(async () => {
      fireEvent.press(disqualifyButton)
    })

    expect(mockHandleDisqualification).toHaveBeenCalledTimes(1)
  })

  test("disqualified group can be undisqualified", async () => {
    const ref = {
      current: { close: null }
    }
    const mockHandleDNF = jest.fn()
    const mockHandleDisqualification = jest.fn()

    render(
      <Provider store={store}>
        <GroupActionMenu
          group={disqualifiedGroup}
          ref={ref as any}
          handleDNF={mockHandleDNF as any}
          handleDisqualification={mockHandleDisqualification as any}
        />
      </Provider>
    )

    const disqualifyButton = screen.getByText("Peru diskaus")
    await act(async () => {
      fireEvent.press(disqualifyButton)
    })

    expect(mockHandleDisqualification).toHaveBeenCalledTimes(1)
  })

  test("dnf group can be undnf", async () => {
    const ref = {
      current: { close: null }
    }
    const mockHandleDNF = jest.fn()
    const mockHandleDisqualification = jest.fn()

    render(
      <Provider store={store}>
        <GroupActionMenu
          group={dnfGroup}
          ref={ref as any}
          handleDNF={mockHandleDNF as any}
          handleDisqualification={mockHandleDisqualification as any}
        />
      </Provider>
    )

    const dnfButton = screen.getByText("Peru keskeytys")
    await act(async () => {
      fireEvent.press(dnfButton)
    })

    expect(mockHandleDNF).toHaveBeenCalledTimes(1)
  })
})