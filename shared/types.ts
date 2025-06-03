export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";
export type PenaltyType = "HINT" | "SKIP" | "OVERTIME";

export type Checkpoint = {
    type: CheckpointType;
    id: number;
    eventId: number | null;
    name: string;
    hint: string | null
}

export type AddCheckpoint = Omit<Checkpoint, "id" | "eventId" | "hint">

export interface RouteLimit {
    id: number,
    minRouteTime: number,
    maxRouteTime: number
}

export interface Route {
  route: number[],
  length: number
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
    type: PenaltyType,
    time: number,
    groupId: number,
    checkpointId: number
}

export interface Group {
    id: number,
    name: string,
    members: number,
    eventId: number | null,
    finishTime: number | null,
    nextCheckpointId: number | null,
    disqualified: boolean,
    penalty: Penalty[],
    route: Checkpoint[],
    dnf: boolean
}

export type AddGroup = Omit<Group, "id" | "disqualified" | "penalty" | "dnf">