import { Type } from "../prisma/prisma/"

export const initialCheckpoints = [
  {
    name: "Oodi",
    type: Type.FINISH,
  },
  {
    name: "Tripla",
    type: Type.START,
  },
  {
    name: "Kumpulan kampus",
    type: Type.INTERMEDIATE,
  }
]

export const finalCheckpoints = [
  {
    name: "Oodi",
    type: Type.FINISH,
  },
  {
    name: "Tripla",
    type: Type.START,
  },
  {
    name: "Kumpulan kampus",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Rautatieasema",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Esplanadi",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Tuomiokirkko",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Kluuvi",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Kauppatori",
    type: Type.INTERMEDIATE,
  },
]

export const intermediateCheckpoints = [
  {
    name: "Kumpulan kampus",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Rautatieasema",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Esplanadi",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Tuomiokirkko",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Kluuvi",
    type: Type.INTERMEDIATE,
  },
  {
    name: "Kauppatori",
    type: Type.INTERMEDIATE,
  },
]

export const initialGroups = [
  {
    name: "Testiryhmä",
    members: 4,
  },
  {
    name: "Toinen ryhmä",
    members: 3,
  },
]

