import { Button, Platform, View } from "react-native"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"

const saveResultsFile = async () => {
  const path = FileSystem.cacheDirectory + "tulokset.txt"
  const content = "Tulokset tulossa"
  await FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 })
}

const shareResultsFile = async () => {
  await Sharing.shareAsync(FileSystem.cacheDirectory + "tulokset.txt")
}

const exportResults = async () => {
  const canShare = await Sharing.isAvailableAsync()
  if (canShare && Platform.OS !== "web") {
    await saveResultsFile()
    await shareResultsFile()
  }
}

const ExportResults = () => {
  return (<View style={{ marginVertical: 10 }}>
    <Button title="Jaa tulokset" onPress={exportResults} />
  </View>)
}

export default ExportResults
