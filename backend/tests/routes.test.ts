import { routeDistance, verifyRoute, getValidRoutes } from "../src/routes"

const checkpoints = [11, 22, 33, 44, 55, 66]
const distances = {
  55: {11: 9999999999, 22: 9999999999, 33: 9999999999, 44: 9999999999, 66: 100000, 77: 9999999999},
  22: {11: 9999999999, 33: 100, 44: 9999999999, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  88: {11: 1, 22: 9999999999, 33: 9999999999, 44: 9999999999, 55: 9999999999, 66: 9999999999},
  11: {22: 10, 33: 9999999999, 44: 9999999999, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  33: {11: 9999999999, 22: 9999999999, 44: 1000, 55: 9999999999, 66: 9999999999, 77: 9999999999},
  44: {11: 9999999999, 22: 9999999999, 33: 9999999999, 55: 10000, 66: 9999999999, 77: 9999999999},
  66: {11: 9999999999, 22: 9999999999, 33: 9999999999, 44: 9999999999, 55: 9999999999, 77: 1000000},
}
const start = 88
const end = 77

const route = [11, 22, 33, 44, 55, 66]
const expectedDistance = 1111111
const length = 4

describe("Routes algorithm", () => {
  test("counts a route distance correctly", () => {
    const returnedDistance = routeDistance(route, distances, start, end)
    expect(returnedDistance).toEqual(expectedDistance);
  })

  test("verifies a route distance correctly", () => {
    const min = expectedDistance
    const max = expectedDistance

    expect(verifyRoute(route, distances, min, max, start, end)).toBeTruthy()
    expect(verifyRoute(route, distances, 0, min-1, start, end)).toBeFalsy()
    expect(verifyRoute(route, distances, max+1, 9999999999999, start, end)).toBeFalsy()
  })

  test("returns unique routes", () => {
    const returnedRoutes = getValidRoutes(checkpoints, distances, 0, 9999999999999, start, end, length)
    const uniqueReturnedRoutes = new Set(returnedRoutes.map(route => route.join()))
    expect(returnedRoutes).toHaveLength(uniqueReturnedRoutes.size)
  })

  test("returns valid permutations", () => {
    const returnedRoutes = getValidRoutes(checkpoints, distances, 0, 9999999999999, start, end, length)

    /*
    check for each route:
    - correct amount of checkpoints
    - each checkpoint is unique
    - each checkpoint is found on the checkpoints list
    */

    returnedRoutes.map((route) => {
      expect(route).toHaveLength(length)

      const routeSet = new Set(route)
      expect(route).toHaveLength(routeSet.size)

      route.map((checkpoint) => {

        expect(checkpoints).toContain(checkpoint)
      })
    })
  })

  test("returns the correct routes", () => {
    const distances = {
      33: {11: 9999, 22: 9999, 44: 1, 55: 9999, 66: 1, 77: 9999},
      88: {11: 1, 22: 9999, 33: 9999, 44: 9999, 77: 1, 66: 9999},
      66: {11: 9999, 22: 9999, 33: 9999, 44: 9999, 55: 1, 66: 9999},
      11: {22: 1, 33: 9999, 44: 9999, 55: 9999, 66: 9999, 77: 9999},
      77: {11: 9999, 22: 1, 33: 9999, 44: 9999, 55: 9999, 77: 9999},
      22: {11: 9999, 33: 1, 44: 9999, 55: 9999, 66: 9999, 77: 9999},
      44: {11: 9999, 22: 9999, 33: 9999, 55: 1, 66: 9999, 77: 9999}
    }
    const checkpoints = [11, 22, 33, 44, 66, 77]
    const start = 88
    const end = 55
    const expectedRoutes = [
      [77, 22, 33, 44],
      [11, 22, 33, 66],
      [11, 22, 33, 44],
      [77, 22, 33, 66]
    ]
    const returnedRoutes = getValidRoutes(checkpoints, distances, 0, 9999, start, end, 4)

    expect(returnedRoutes.sort()).toStrictEqual(expectedRoutes.sort())
  })
})
