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
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: Math.min(screenWidth * 0.8, 355),
    paddingVertical: 7,
    marginBottom:10,
    color: theme.colors.textInput,
    backgroundColor: "white",
  },
  button: {
    height: 30,
    width: Math.min(screenWidth * 0.8, 355),
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
    borderRadius: 12,
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
    width: "100%",
    justifyContent: "flex-start",
  },
  checkpointName: {
    fontSize: theme.fontSizes.listItem,
    fontWeight: "600",
    color: "#000",
    padding: 0,
    margin: 0,
    lineHeight: 20,
  },
  checkpointType: {
    fontWeight: "400",
    color: "#666",
    fontSize: theme.fontSizes.body,
    lineHeight: 20,
    margin: 0,
    padding: 0,
  },
  checkpointcontainer: {
    marginBottom: 75
  },
  breadText: {
    color: theme.colors.textBread,
  },
  formText: {
    color: theme.colors.background,
    fontWeight: "bold",
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
  formContainer: {
    backgroundColor: theme.colors.listItemBackground,
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  radiobuttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  radiobuttonItem: {
    flexDirection: "row",
    alignItems: "center"
  },
})
