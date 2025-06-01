export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";

export type Checkpoint = {
    type: CheckpointType | null;
    id: number;
    eventId: number | null;
    name: string;
    hint: string | null
}

export interface RouteLimit {
    id: number,
    min_route_time: number,
    max_route_time: number
}

export interface Distances {
  [start:number]: {[end:number]: number}
}

export type NotificationState = {
    message: string,
    type: "error" | "success" | null
}

export type Group = {
    id?: number,
    name: string,
    members: number,
}