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

export const route_distance = (route: number[], distances: Distances): number => {
  const array_length = route.length;

  // Start to checkpoint 1.
  let current_distance = distances[0][route[0]];

  for (let i = 0; i < array_length - 1; i++) {
    current_distance += distances[route[i]][route[i+1]];
  }

  // Checkpoint n to finish.
  current_distance += distances[route[array_length-1]][array_length+1];
  return current_distance;
}

// Verifies that the route length is within specified bounds.
const verify_route = (permutation: number[], distances: Distances, min: number, max: number): boolean => {
  const distance = route_distance(permutation, distances);
  return distance >= min && distance <= max;
}

export const get_valid_routes = (checkpoints: number[], distances: Distances, min: number, max: number): number[][] => {
  const permutations = [...new Permutation(checkpoints)];
  return permutations.filter((permutation) => {
    return verify_route(permutation, distances, min, max);
  });
};
