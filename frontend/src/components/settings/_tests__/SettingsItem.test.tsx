import { render, screen } from "@testing-library/react-native"
import SettingsItem from "../SettingsItem"
import { styles } from "@/styles/commonStyles"

describe("SettingsItem", () => {
  test("renders the text prop", () => {
    render(
      <SettingsItem text="Test Item" link="/" />
    )
    expect(screen.getByText("Test Item")).toBeTruthy()
  })

  test("applies normal style when dimmed is false", () => {
    const { UNSAFE_getByType } = render(
      <SettingsItem text="Test Item" link="/" dimmed={false} />
    )
    const touchableOpacity = UNSAFE_getByType(require("react-native").TouchableOpacity)
    expect(touchableOpacity.props.style).toEqual(styles.item)
  })

  test("applies dimmed style when dimmed is true", () => {
    const { UNSAFE_getByType } = render(
      <SettingsItem text="Test Item" link="/" dimmed={true} />
    )
    const touchableOpacity = UNSAFE_getByType(require("react-native").TouchableOpacity)
    expect(touchableOpacity.props.style).toEqual(styles.dimmedItem)
  })

  test("renders Link component with correct href", () => {
    const { UNSAFE_getByType } = render(
      <SettingsItem text="Test Item" link="/test-route" />
    )
    const link = UNSAFE_getByType(require("expo-router").Link)
    expect(link.props.href).toBe("/test-route")
  })

  test("renders Link with asChild prop", () => {
    const { UNSAFE_getByType } = render(
      <SettingsItem text="Test Item" link="/test-route" />
    )
    const link = UNSAFE_getByType(require("expo-router").Link)
    expect(link.props.asChild).toBe(true)
  })

  test("renders chevron icon", () => {
    const { UNSAFE_getByType } = render(
      <SettingsItem text="Test Item" link="/test-route" />
    )
    const chevronIcon = UNSAFE_getByType(require("@expo/vector-icons").Entypo)
    expect(chevronIcon.props.name).toBe("chevron-right")
    expect(chevronIcon.props.size).toBe(24)
    expect(chevronIcon.props.color).toBe("black")
  })

  test("Link wraps TouchableOpacity as child", () => {
    const { UNSAFE_getByType } = render(
      <SettingsItem text="Test Item" link="/test-route" />
    )
    const link = UNSAFE_getByType(require("expo-router").Link)
    const touchableOpacity = UNSAFE_getByType(require("react-native").TouchableOpacity)
    
    expect(link.props.children).toBeTruthy()
  })
})