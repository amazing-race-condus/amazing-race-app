import { Type } from "../prisma/prisma/"
import { Checkpoint, CheckpointType } from "@/types"

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

export const checkpoints = [
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
    easy: false
  },
  {
    name: "Toinen ryhmä",
    members: 3,
    easy: true
  },
]

export const checkpointsForRoutes1: Checkpoint[] = [ {
  id: 77,
  eventId: null,
  hint: null,
  name: "Oodi",
  type: "FINISH" as CheckpointType,
  easyHint: null
},
{
  id: 55,
  eventId: null,
  hint: null,
  name: "Tripla",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 22,
  eventId: null,
  hint: null,
  name: "Kumpulan kampus",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 11,
  eventId: null,
  hint: null,
  name: "Rautatieasema",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 66,
  eventId: null,
  hint: null,
  name: "Tuomiokirkko12",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 33,
  eventId: null,
  hint: null,
  name: "Esplanadi",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 44,
  eventId: null,
  hint: null,
  name: "Tuomiokirkko",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 88,
  eventId: null,
  hint: null,
  name: "Tuomiokirkk1o",
  type: "START" as CheckpointType,
  easyHint: null
}
]

export const checkpointsForRoutes2: Checkpoint[] = [ {
  id: 77,
  eventId: null,
  hint: null,
  name: "Oodi",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 55,
  eventId: null,
  hint: null,
  name: "Tripla",
  type: "FINISH" as CheckpointType,
  easyHint: null
},
{
  id: 22,
  eventId: null,
  hint: null,
  name: "Kumpulan kampus",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 11,
  eventId: null,
  hint: null,
  name: "Rautatieasema",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 66,
  eventId: null,
  hint: null,
  name: "Tuomiokirkko12",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 33,
  eventId: null,
  hint: null,
  name: "Esplanadi",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 44,
  eventId: null,
  hint: null,
  name: "Tuomiokirkko",
  type: "INTERMEDIATE" as CheckpointType,
  easyHint: null
},
{
  id: 88,
  eventId: null,
  hint: null,
  name: "Tuomiokirkk1o",
  type: "START" as CheckpointType,
  easyHint: null
}
]

export const distances1 = {
  55: {11: 9999999999, 22: 9999999999, 33: 9999999999, 44: 9999999999, 66: 100000, 77: 9999999999},
  22: {11: 9999999999, 33: 100, 44: 9999999999, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  88: {11: 1, 22: 9999999999, 33: 9999999999, 44: 9999999999, 55: 9999999999, 66: 9999999999},
  11: {22: 10, 33: 9999999999, 44: 9999999999, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  33: {11: 9999999999, 22: 9999999999, 44: 1000, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  44: {11: 9999999999, 22: 9999999999, 33: 9999999999, 55: 10000, 66: 9999999999, 77: 9999999999},
  66: {11: 9999999999, 22: 9999999999, 33: 9999999999, 44: 9999999999, 55: 9999999999, 77: 1000000},
}

export const distances2 = {
  33: {11: 9999, 22: 9999, 44: 1, 55: 9999, 66: 1, 77: 9999},
  88: {11: 1, 22: 9999, 33: 9999, 44: 9999, 77: 1, 66: 9999},
  66: {11: 9999, 22: 9999, 33: 9999, 44: 9999, 55: 1, 77: 9999},
  11: {22: 1, 33: 9999, 44: 9999, 55: 9999, 66: 9999, 77: 9999},
  77: {11: 9999, 22: 1, 33: 9999, 44: 9999, 55: 9999, 66: 9999},
  22: {11: 9999, 33: 1, 44: 9999, 55: 9999, 66: 9999, 77: 9999},
  44: {11: 9999, 22: 9999, 33: 9999, 55: 1, 66: 9999, 77: 9999}
}
