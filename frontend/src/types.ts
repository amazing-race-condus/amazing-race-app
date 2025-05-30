export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";

export type Checkpoint = {
  id: string;
  name: string;
  type: CheckpointType
}

export interface RouteLimit {
    id: number,
    minRouteTime: number,
    maxRouteTime: number
}

export interface Distances {
  [start:number]: {[end:number]: number}
}

export type NotificationState = {
    message: string,
    type: "error" | "success" | null
}

export type Group = {
    id: number,
    name: string,
    members: number,
}