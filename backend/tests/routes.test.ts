import { routeDistance, verifyRoute, getValidRoutes } from "../src/routes"
import { Checkpoint, CheckpointType } from "@/types"

const checkpoints: Checkpoint[] = [ {
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
const distances = {
  55: {11: 9999999999, 22: 9999999999, 33: 9999999999, 44: 9999999999, 66: 100000, 77: 9999999999},
  22: {11: 9999999999, 33: 100, 44: 9999999999, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  88: {11: 1, 22: 9999999999, 33: 9999999999, 44: 9999999999, 55: 9999999999, 66: 9999999999},
  11: {22: 10, 33: 9999999999, 44: 9999999999, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  33: {11: 9999999999, 22: 9999999999, 44: 1000, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  44: {11: 9999999999, 22: 9999999999, 33: 9999999999, 55: 10000, 66: 9999999999, 77: 9999999999},
  66: {11: 9999999999, 22: 9999999999, 33: 9999999999, 44: 9999999999, 55: 9999999999, 77: 1000000},
}

const route = [88, 11, 22, 33, 44, 55, 66, 77]
const expectedDistance = 1111111
const length = 4

describe("Routes algorithm", () => {
  test("counts a route distance correctly", () => {
    const returnedDistance = routeDistance(route, distances)
    expect(returnedDistance).toEqual(expectedDistance);
  })

  test("verifies a route distance correctly", () => {
    const min = expectedDistance
    const max = expectedDistance

    expect(verifyRoute(route, distances, min, max)).toBeTruthy()
    expect(verifyRoute(route, distances, 0, min-1)).toBeFalsy()
    expect(verifyRoute(route, distances, max+1, 9999999999999)).toBeFalsy()
  })

  test("returns unique routes", () => {
    const returnedRoutes = getValidRoutes(checkpoints, distances, 1, 9999999999999, length)
    const uniqueReturnedRoutes = new Set(returnedRoutes.map(route => route.route.join()))
    expect(returnedRoutes).toHaveLength(uniqueReturnedRoutes.size)
  })

  test("returns valid permutations", () => {
    const returnedRoutes = getValidRoutes(checkpoints, distances, 1, 9999999999999, length)
    /*
    check for each route:
    - correct amount of checkpoints
    - each checkpoint is unique
    - each checkpoint is found on the checkpoints list
    */

    returnedRoutes.map((route) => {
      expect(route.route).toHaveLength(length+2)

      const routeSet = new Set(route.route)
      expect(route.route).toHaveLength(routeSet.size)

      route.route.map((checkpoint) => {

        expect(checkpoints.map(c => c.id)).toContain(checkpoint)
      })
    })
  })

  test("returns the correct routes", () => {
    const checkpoints: Checkpoint[] = [ {
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
    const distances = {
      33: {11: 9999, 22: 9999, 44: 1, 55: 9999, 66: 1, 77: 9999},
      88: {11: 1, 22: 9999, 33: 9999, 44: 9999, 77: 1, 66: 9999},
      66: {11: 9999, 22: 9999, 33: 9999, 44: 9999, 55: 1, 66: 9999},
      11: {22: 1, 33: 9999, 44: 9999, 55: 9999, 66: 9999, 77: 9999},
      77: {11: 9999, 22: 1, 33: 9999, 44: 9999, 55: 9999, 77: 9999},
      22: {11: 9999, 33: 1, 44: 9999, 55: 9999, 66: 9999, 77: 9999},
      44: {11: 9999, 22: 9999, 33: 9999, 55: 1, 66: 9999, 77: 9999}
    }
    const expectedRoutes = [
      [88, 77, 22, 33, 44, 55],
      [88, 11, 22, 33, 66, 55],
      [88, 11, 22, 33, 44, 55],
      [88, 77, 22, 33, 66, 55]
    ]
    const returnedRoutes = getValidRoutes(checkpoints, distances, 1, 9999, 4)

    expect(returnedRoutes.map(r => r.route).sort()).toStrictEqual(expectedRoutes.sort())
  })
})
