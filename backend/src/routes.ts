import { Permutation } from "js-combinatorics";

/*
Usage:

get_valid_routes requires six arguments: checkpoints (array of integers, i.e. indices of the checkpoints), distances
(object, see interface below), minimum and maximum length of the routes, and start and end points. Note that the array checkpoints should not contain
the start and end points. Returns an array of arrays of integers, describing the route (without start or end points).
*/

interface Distances {
  [start:number]: {[end:number]: number}
}

export const routeDistance = (route: number[], distances: Distances, start: number, end: number): number => {
  const wholeRoute = [start].concat(route, [end])

  // From start point to the first checkpoint.
  let currentDistance = distances[wholeRoute[0]][wholeRoute[1]]

  // To next checkpoints and the end point.
  for (let i = 2; i < wholeRoute.length; i++) {
    const prev_cp = wholeRoute[i-1]
    const curr_cp = wholeRoute[i]
    currentDistance += distances[prev_cp][curr_cp]}

  return currentDistance;
}

// Verifies that the route length is within specified bounds.
export const verifyRoute = (permutation: number[], distances: Distances, min: number, max: number, start: number, end: number): boolean => {
  const distance = routeDistance(permutation, distances, start, end);
  return distance >= min && distance <= max;
}

export const getValidRoutes = (checkpoints: number[], distances: Distances, min: number, max: number, start: number, end: number, length: number = 4): number[][] => {
  const permutations = [...new Permutation(checkpoints, length)];
  return permutations.filter((permutation) => {
    return verifyRoute(permutation, distances, min, max, start, end);
  });
};
