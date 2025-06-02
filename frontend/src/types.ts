export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";
export type PenaltyType = "HINT" | "SKIP" | "OVERTIME";

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
    type: PenaltyType,
    time: number,
    groupId: number,
    checkpointId: number
}

export interface Group {
    id: number,
    name: string,
    members: number,
    disqualified: boolean,
    penalty: Penalty[],
    dnf: boolean
}

export type AddGroup = Omit<Group, "id" | "disqualified" | "penalty" | "dnf">