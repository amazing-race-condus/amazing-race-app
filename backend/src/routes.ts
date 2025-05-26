import { Permutation } from "js-combinatorics";

/*
Usage:

get_valid_routes requires four arguments: checkpoints (array of integers, i.e. indices of the checkpoints), distances
(object, see interface below), and minimum and maximum length of the routes. Note that the array checkpoint should not contain
the start and end points. Returns an array of arrays of integers, describing the route (without start or end points).
*/


interface Distances {
  [start:number]: {[end:number]: number}
}

export const routeDistance = (route: number[], distances: Distances): number => {
  const arrayLength = route.length;

  // Start to checkpoint 1.
  let currentDistance = distances[0][route[0]];

  for (let i = 0; i < arrayLength - 1; i++) {
    currentDistance += distances[route[i]][route[i+1]];
  }

  // Checkpoint n to finish.
  currentDistance += distances[route[arrayLength-1]][arrayLength+1];
  return currentDistance;
}

// Verifies that the route length is within specified bounds.
const verifyRoute = (permutation: number[], distances: Distances, min: number, max: number): boolean => {
  const distance = routeDistance(permutation, distances);
  return distance >= min && distance <= max;
}

export const getValidRoutes = (checkpoints: number[], distances: Distances, min: number, max: number): number[][] => {
  const permutations = [...new Permutation(checkpoints, 4)];
  return permutations.filter((permutation) => {
    return verifyRoute(permutation, distances, min, max);
  });
};
