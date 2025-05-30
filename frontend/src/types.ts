export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";

export type Checkpoint = {
  id: number;
  name: string;
  type: CheckpointType
}

export type AddCheckpoint = Omit<Checkpoint, "id">

export interface RouteLimit {
    id: number,
    minRouteTime: number,
    maxRouteTime: number
}

export interface Distances {
  [start:number]: {[end:number]: number}
}

export type Notification = {
    message: string,
    type: "error" | "success" | null
}

export interface Penalty {
    id: number,
    time: number,
    group_id: number,
}

export interface Group {
    id: number,
    name: string,
    members: number,
    disqualified: boolean,
    penalty: Penalty[],
}

export type AddGroup = Omit<Group, "id" | "disqualified" | "penalty">