import { routeDistance, verifyRoute, getValidRoutes } from "../src/services/routes"
import { validateCheckpointDistances, validateMinAndMax } from "../src/utils/routeValidators"
import { distances1, distances2, checkpointsForRoutes1, checkpointsForRoutes2 } from "./test_helper"

const route = [88, 11, 22, 33, 44, 55, 66, 77]
const expectedDistance = 1111111
const length = 4

describe("Routes algorithm", () => {
  it("counts a route distance correctly", () => {
    const returnedDistance = routeDistance(route, distances1)
    expect(returnedDistance).toEqual(expectedDistance)
  })

  it("verifies a route distance correctly", () => {
    const min = expectedDistance
    const max = expectedDistance

    expect(verifyRoute(route, distances1, min, max)).toBeTruthy()
    expect(verifyRoute(route, distances1, 0, min-1)).toBeFalsy()
    expect(verifyRoute(route, distances1, max+1, 9999999999999)).toBeFalsy()
  })

  it("returns unique routes", () => {
    const returnedRoutes = getValidRoutes(checkpointsForRoutes1, distances1, 1, 9999999999999, length)
    const uniqueReturnedRoutes = new Set(returnedRoutes.map(route => route.route.join()))
    expect(returnedRoutes).toHaveLength(uniqueReturnedRoutes.size)
  })

  it("returns valid permutations", () => {
    const returnedRoutes = getValidRoutes(checkpointsForRoutes1, distances1, 1, 9999999999999, length)
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

        expect(checkpointsForRoutes1.map(c => c.id)).toContain(checkpoint)
      })
    })
  })

  it("returns the correct routes", () => {
    const expectedRoutes = [
      [88, 77, 22, 33, 44, 55],
      [88, 11, 22, 33, 66, 55],
      [88, 11, 22, 33, 44, 55],
      [88, 77, 22, 33, 66, 55]
    ]
    const returnedRoutes = getValidRoutes(checkpointsForRoutes2, distances2, 1, 9999, 4)

    expect(returnedRoutes.map(r => r.route).sort()).toStrictEqual(expectedRoutes.sort())
  })

  it("validator returns true for valid distances", () => {
    const distancesAreValid = validateCheckpointDistances(distances2, checkpointsForRoutes2)
    expect(distancesAreValid).toBeTruthy()
  })

  it("validator returns false for invalid distances", () => {
    const invalidDistances = {
      11: {22: 14, 33: 4},
      22: {11: 15, 33: 5}
    }
    expect(validateCheckpointDistances({}, [])).toBeFalsy()
    expect(validateCheckpointDistances(invalidDistances, checkpointsForRoutes2)).toBeFalsy()
  })

  it("validator returns true for valid limits", () => {
    expect(validateMinAndMax(90, 120)).toBe("")
  })

  it ("validator returns false for invalid limits", () => {
    expect(validateMinAndMax(-15, 0)).not.toBe("")
    expect(validateMinAndMax(120, 90)).not.toBe("")
    expect(validateMinAndMax(1.4, 2.5)).not.toBe("")
  })
})
