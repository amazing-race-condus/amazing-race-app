import { StyleSheet, Dimensions } from "react-native"
import Constants from "expo-constants"
import theme from "@/theme"

const screenWidth = Dimensions.get("window").width

export const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    margin: 10,
    fontSize: theme.fontSizes.header,
    fontWeight: "bold",
    color: theme.colors.textTitle,
  },
  content: {
    backgroundColor: theme.colors.background,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    width: Math.min(screenWidth * 0.9, 355),
    paddingVertical: 7,
    marginBottom:10,
    color: theme.colors.inputField,
  },
  button: {
    height: 30,
    width: Math.min(screenWidth * 0.9, 355),
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: theme.colors.textButton,
    fontSize: theme.fontSizes.button,
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: theme.colors.listItemBackground,
    width: Math.min(screenWidth * 0.9, 320),
  },
  title: {
    fontSize: 35,
    margin: 10,
    fontWeight: "600",
    color: theme.colors.textTitle,
    textAlign: "center",
  },
  separator: {
    height: 5,
  },
  listcontainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  checkpointName: {
    fontSize: theme.fontSizes.listItem,
    fontWeight: "600",
    margin: 10,
    color: "#000",
  },
  checkpointcontainer: {
    marginBottom: 75
  },
  breadText: {
    color: theme.colors.textBread,
  },
  notification: {
    backgroundColor: theme.colors.notificationBackground,
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    fontSize: 20,
    padding: 10,
    marginBottom: 10
  },
  error: {
    backgroundColor: theme.colors.errorBackground,
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    fontSize: 20,
    padding: 10,
    marginBottom: 10
  },
  smallButton: {
    height: 30,
    width: 80,
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
})
