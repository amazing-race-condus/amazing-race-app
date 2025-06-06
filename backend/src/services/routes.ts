import { Permutation } from "js-combinatorics"
import { Distances, Checkpoint, Route } from "@/types"

export const routeDistance = (route: number[], distances: Distances): number => {
  // From start point to the first checkpoint.
  let currentDistance = distances[route[0]][route[1]]

  // To next checkpoints and the end point.
  for (let i = 2; i < route.length; i++) {
    const prev_cp = route[i-1]
    const curr_cp = route[i]
    currentDistance += distances[prev_cp][curr_cp]}

  return currentDistance
}

// Verifies that the route length is within specified bounds.
export const verifyRoute = (route: number[], distances: Distances, min: number, max: number): boolean => {
  const distance = routeDistance(route, distances)
  return distance >= min && distance <= max
}


export const getValidRoutes = (checkpoints: Checkpoint[], distances: Distances, min: number | null, max: number | null, length: number = 4): Route[] => {
  const start = checkpoints.find(checkpoint => checkpoint.type === "START")
  const finish = checkpoints.find(checkpoint => checkpoint.type === "FINISH")

  if (!start || !finish || !min || !max) {
    const test: Route[] = [{route: [], length: 0}]
    return test
  }

  const intermediateIds: number[] = checkpoints
    .filter(checkpoint => checkpoint.type === "INTERMEDIATE")
    .map(checkpoint => checkpoint.id)

  const permutations = [...new Permutation(intermediateIds, length)]
  const routes = permutations.map(perm => ([start.id, ...perm, finish.id]))

  const validRoutes = routes.filter((route) => {
    return verifyRoute(route, distances, min, max)
  })

  const routesWithLengths: Route[] = validRoutes.map(route => ({
    route: route,
    length: routeDistance(route, distances)
  }))

  return routesWithLengths
}
