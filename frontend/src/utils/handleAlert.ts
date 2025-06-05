import { Alert, Platform } from "react-native"

export const handleAlert = (
  { confirmText, style, title, message, onConfirm }:
  {
    confirmText: string,
    style?: "cancel" | "default" | "destructive" | undefined,
    title: string,
    message: string,
    onConfirm: () => void
  }
) => {
  if (Platform.OS === "web") {
    const confirmed = window.confirm(message)
    if (confirmed) {
      onConfirm()
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: "Peru", style: "cancel" },
        {
          text: confirmText,
          style: style,
          onPress: () => onConfirm()
        }
      ]
    )
  }
}