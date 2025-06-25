import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx"
import { getRaceTime, formatDate } from "./timeUtils"
import { sortByTime } from "./groupUtils"
import { getPenaltyMinutes } from "./penaltyUtils"
import { getAllGroups } from "@/services/groupService"
import { Event, Group } from "@/types"

const exportResult = async (event: Event) => {
  try {
    const groups = await getAllGroups(event.id)
    if (!groups) {
      return null
    } else if (groups.length === 0) {
      return null
    }
    const normalGroups = sortByTime(groups.filter(group => !group.easy), event)
    const easyGroups = sortByTime(groups.filter(group => group.easy), event)
    const normalTable = createTable(formatData(normalGroups, event))
    const easyTable = createTable(formatData(easyGroups, event))

    const document = createDocument(easyTable, normalTable, event)
    return document
  } catch {
    return null
  }
}

const createDocument = (easyTable: Table, normalTable: Table, event: Event) => {
  const eventDate = new Date(event.eventDate)

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Tulokset",
            alignment: "center",
            heading: "Heading1"
          }),
          new Paragraph(""),
          new Paragraph({
            children: [
              new TextRun({ text: "Tapahtuma: ", bold: true }),
              new TextRun(event.name)
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Päivämäärä: ", bold: true }),
              new TextRun(formatDate(eventDate))
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Aloitettu: ", bold: true }),
              new TextRun(event.startTime ? formatMinutesAndSeconds(event.startTime) : "")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Päätetty: ", bold: true }),
              new TextRun(event.endTime ? formatMinutesAndSeconds(event.endTime) : "")
            ]
          }),
          new Paragraph(""),
          new Paragraph({
            text: "Tavalliset ryhmät",
            alignment: "center",
            heading: "Heading3"
          }),
          new Paragraph(""),
          normalTable,
          new Paragraph(""),
          new Paragraph({
            text: "Helpotetut ryhmät",
            alignment: "center",
            heading: "Heading3"
          }),
          new Paragraph(""),
          easyTable
        ],
      },
    ],
  })
  return Packer.toBlob(doc)
}

const createTable = (content: string[][]) => {
  const headerRow = new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ryhmän nimi", bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Rankut minuutteina", bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Maaliin saapumisaika", bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Lopullinen aika", bold: true })] })] }),
    ],
  })

  const dataRows = content.map((row: string[]) =>
    new TableRow({
      children: row.map((field) =>
        new TableCell({
          children: [
            new Paragraph(
              field
            ),
          ],
        })
      ),
    })
  )

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    }
  })
  return table
}

const formatData = (groups: Group[], event: Event, ): string[][] => {
  const content = groups.map(g => [g.name, statusText(g), String(getPenaltyMinutes(g)), formatMinutesAndSeconds(g.finishTime), g.finishTime ? formatTime(g, event) : ""])
  return content
}

const formatMinutesAndSeconds = (date: Date | null) => {
  if (date === null) {
    return ""
  }
  const dateObject = new Date(date)
  const datetext = dateObject.toTimeString().split(" ")[0].split(":")
  const hours = datetext[0]
  const minutes = datetext[1]
  return `${hours}.${minutes}`
}

const formatTime = (group: Group, event: Event) => {
  let timeInSeconds = getRaceTime(group, event)
  if (timeInSeconds === null) {
    return ""
  }
  const hours = Math.floor(timeInSeconds / 3600)
  timeInSeconds %= 3600
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  return `${hours}h ${minutes}min ${seconds}s`
}

const statusText = (group: Group) => {
  if (group.disqualified)
    return "Diskattu"
  if (group.dnf)
    return "Peli keskeytetty"
  if (!group.route)
    return "Ei reittiä"
  if (group.route.length === 0)
    return "Ei reittiä."
  if (group.route[0].id === group.nextCheckpointId)
    return "Ei aloitettu"
  if (group.finishTime)
    return "Saapunut maaliin"
  return "Suoritus kesken"
}

export default exportResult