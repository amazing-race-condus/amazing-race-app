export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";
export type PenaltyType = "HINT" | "SKIP" | "OVERTIME";

export type Checkpoint = {
    type: CheckpointType;
    id: number;
    eventId: number | null;
    name: string;
    hint: string | null;
    easyHint: string | null;
}

export type AddCheckpoint = Omit<Checkpoint, "id" | "eventId" | "hint" | "easyHint">

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
    type: "error" | "success" | "warning" | null
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
    dnf: boolean,
    easy: boolean
}

export interface Event {
    id: number,
    name: string,
    startTime: Date | null,
    endTime: Date | null,
    minRouteTime: number,
    maxRouteTime: number,
    group: Group[],
    checkpoints: Checkpoint[],
    routeLimits: RouteLimit[],
    penalties: Penalty[]
}


export type AddGroup = Omit<Group, "id" | "finishTime" | "eventId" | "nextCheckpointId" | "route" | "disqualified" | "penalty" | "dnf">

