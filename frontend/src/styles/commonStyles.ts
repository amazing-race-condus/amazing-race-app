import { StyleSheet, Dimensions } from "react-native"

const screenWidth = Dimensions.get("window").width

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d3f5c",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    margin: 10,
    fontSize: 24,
    fontWeight: "600",
    color: "#fcba03",
  },
  link: {
    margin: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: "#abbbd4",
    width: "90%",
    borderRadius: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },
  content: {
    backgroundColor: "#2d3f5c",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 50
  },
  links: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "center"
  },
  inputField: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    width: Math.min(screenWidth * 0.9, 355),
    paddingVertical: 7,
    textAlignVertical: "auto",
    marginBottom:10,
    color: "white",
  },
  button: {
    height: 30,
    width: Math.min(screenWidth * 0.9, 355),
    backgroundColor: "#007AFF",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ceddf0",
    alignItems: "center",
    fontSize: 20,
  },
  title: {
    fontSize: 35,
    margin: 10,
    fontWeight: "600",
    color: "#fcba03",
    textAlign: "center"
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
    fontSize: 25,
    fontWeight: "600",
    margin: 10,
    color: "#000",
  },
  checkpointcontainer: {
    marginBottom: 75
  },
  breadText: {
    color: "white",
  },
  notification: {
    backgroundColor: "#1c4f10",
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    fontSize: 20,
    padding: 10,
    marginBottom: 10
  }
})
