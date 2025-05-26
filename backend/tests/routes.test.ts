import { routeDistance, getValidRoutes } from "../src/routes"

const checkpoints = [1, 2, 3, 4, 5, 6]

const distances = {
  0: {1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60},
  1: {2: 21, 3: 31, 4: 41, 5: 51, 6: 61, 7: 71},
  2: {1: 12, 3: 32, 4: 42, 5: 52, 6: 62, 7: 72},
  3: {1: 13, 2: 23, 4: 43, 5: 53, 6: 63, 7: 73},
  4: {1: 14, 2: 24, 3: 34, 5: 54, 6: 64, 7: 74},
  5: {1: 15, 2: 25, 3: 35, 4: 45, 6: 65, 7: 75},
  6: {1: 16, 2: 26, 3: 36, 4: 46, 5: 56, 7: 76}
}

describe("Routes algorithm", () => {
  test("counts route distance correctly", () => {
    const route = [1, 2, 3, 4, 5, 6]
    const expectedDistance = 10 + 21 + 32 + 43 + 54 + 65 + 76
    const returnedDistance = routeDistance(route, distances)

    expect(returnedDistance).toBe(expectedDistance);
  })

  /*
  test("returns valid permutations", () => {
    const returnedRoutes = getValidRoutes(checkpoints, distances, 0, 100000)
    const nonValidRoutes = returnedRoutes.filter((route) => { route.sort(); return route.join() !== checkpoints.join(); })

    expect(nonValidRoutes.length).toBe(0);
  })

  test("returns correct routes", () => {
    const checkpoints = [1, 2, 3]
    const distances = {
      0: {1: 25, 2: 25, 3: 100},
      1: {2: 25, 3: 25},
      2: {1: 25, 3: 25, 4: 100},
      3: {1: 100, 2: 100, 4: 25},
    }
    const min = 90
    const max = 110

    const expectedRoutes = [[1, 2, 3], [2, 1, 3]]
    const returnedRoutes = getValidRoutes(checkpoints, distances, min, max)

    expect(returnedRoutes.join()).toBe(expectedRoutes.join());
  })
  */
});
