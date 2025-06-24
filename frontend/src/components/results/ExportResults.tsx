import { Button, Platform, View } from "react-native"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { Event, Group } from "@/types"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { sortByTime, getProgress } from "@/utils/groupUtils"
import { getRaceTime } from "@/utils/timeUtils"

const resultRowsText = (event: Event | null, groups: Group[] | null) => {
  if (!event || !groups)
    return ""

  let content = ""

  groups.forEach((group, i) => {
    const time = getRaceTime(group, event)
    const timePrint = (time !== null) ? String(Math.round(time/60*100)/100) + " min" : "-"
    content += statusText(event, group, i+1)
    content += "\t"
    content += getProgress(group) + " rastia"
    content += "\t"
    content += timePrint
    content += "\t"
    content += group.name
    content += "\n"
  })
  return content
}

const statusText = (event: Event, group: Group, ranking: number) => {
  if (group.disqualified)
    return "Disk."
  if (group.dnf)
    return "Kesk."
  if (!group.route)
    return "Ei reittiä!"
  if (group.route.length === 0)
    return "Ei reittiä!"
  if (group.route[0].id === group.nextCheckpointId)
    return "Ei al."
  if (group.finishTime && !group.disqualified && !group.dnf && group.nextCheckpointId === null)
    return event.endTime ? "Sija " + ranking : "Sija ?"
  return "Kesken"
}

const resultsFileContent = (event: Event, groups: Group[]) => {
  const normalGroups = groups.filter(group => !group.easy)
  const easyGroups = groups.filter(group => group.easy)

  let normalPassedGroups = normalGroups.filter(group => group.finishTime && !group.disqualified && !group.dnf && group.nextCheckpointId === null)
  let easyPassedGroups = easyGroups.filter(group => group.finishTime && !group.disqualified && !group.dnf && group.nextCheckpointId === null)

  normalPassedGroups = sortByTime(normalPassedGroups, event)
  easyPassedGroups = sortByTime(easyPassedGroups, event)

  const normalOtherGroups = normalGroups.filter(group => (!(group.finishTime && !group.disqualified && !group.dnf && group.nextCheckpointId === null)))
  const easyOtherGroups = easyGroups.filter(group => (!(group.finishTime && !group.disqualified && !group.dnf && group.nextCheckpointId === null)))

  normalOtherGroups.sort((a, b) => {
    let progressA = getProgress(a)
    let progressB = getProgress(b)
    if (progressA === null)
      progressA = -1
    if (progressB === null)
      progressB = -1
    return progressB - progressA
  })

  easyOtherGroups.sort((a, b) => {
    const progressA = getProgress(a)
    const progressB = getProgress(b)
    if (!progressA || !progressB)
      return 0
    return progressA - progressB
  })

  let content = "Tulokset\n\n"

  content += "Tapahtuman nimi: " + event.name + "\n"
  content += "Aloitettu: " + event.startTime + "\n"
  content += "Päätetty: " + event.endTime + "\n\n"

  content += "TAVALLISET RYHMÄT\n\n"
  content += "Status  Edistys Aika  Ryhmän nimi\n"
  content += resultRowsText(event, normalPassedGroups)
  content += resultRowsText(event, normalOtherGroups)

  content += "\nHELPOTETUT RYHMÄT\n\n"
  content += "Status  Edistys Aika  Ryhmän nimi\n"
  content += resultRowsText(event, easyPassedGroups)
  content += resultRowsText(event, easyOtherGroups)

  return content
}

const saveResultsFile = async (event: Event, groups: Group[]) => {
  const path = FileSystem.cacheDirectory + "tulokset.txt"
  await FileSystem.writeAsStringAsync(path, resultsFileContent(event, groups), { encoding: FileSystem.EncodingType.UTF8 })
}

const shareResultsFile = async () => {
  await Sharing.shareAsync(FileSystem.cacheDirectory + "tulokset.txt")
}

const exportResults = async (event: Event, groups: Group[]) => {
  const canShare = await Sharing.isAvailableAsync()
  if (canShare) {
    await saveResultsFile(event, groups)
    await shareResultsFile()
  }
}

const exportResultsWeb = (event: Event, groups: Group[]) => {
  const fileName = "amazing-race-tulokset.txt"
  const file = new File([resultsFileContent(event, groups)], fileName, {type: "text/plain;charset=utf-8"})
  const fileUrl = URL.createObjectURL(file)

  const a = document.createElement("a")
  a.href = fileUrl
  a.download = fileName
  a.click()

  URL.revokeObjectURL(fileUrl)
}

const ExportResults = () => {
  const event = useSelector((state: RootState) => state.event)
  const groups = useSelector((state: RootState) => state.groups)

  return (
    <View style={{ marginVertical: 10 }}>
      {Platform.OS !== "web" && <Button title="Jaa tulokset (.txt)" onPress={() => exportResults(event, groups)} />}
      {Platform.OS === "web" && <Button title="Lataa tulokset (.txt)" onPress={() => exportResultsWeb(event, groups)} />}
    </View>)
}

export default ExportResults
