export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";
export type PenaltyType = "HINT" | "SKIP" | "OVERTIME";
export type CompleteType = "NORMAL" | "SKIP" | "OVERTIME";

export type Checkpoint = {
    type: CheckpointType;
    id: number;
    eventId: number | null;
    name: string;
    hint: string | null;
    easyHint: string | null;
}

export type AddCheckpoint = Omit<Checkpoint, "id" >

export interface RouteLimit {
    id: number,
    minRouteTime: number,
    maxRouteTime: number
}

export interface Route {
  route: number[],
  length: number
}

export interface RouteStep {
  id: number,
  routeId: number,
  checkpointId: number,
  checkpointOrder: number
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

export interface User {
    id: number,
    username: string
    password?: string
}

export interface Group {
    id: number,
    name: string,
    members: number,
    eventId: number | null,
    finishTime: Date | null,
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
    minRouteTime: number | null,
    maxRouteTime: number | null,
    eventDate: Date | null,
    group: Group[],
    checkpoints: Checkpoint[],
    penalties: Penalty[]
}

export interface CustomRequest extends Request {
  token?: string | null
  user?: User | null
}

export type RouteInfo = { id: number, routeTime: number }

export type AddEvent = Omit<Event, "id" | "startTime" | "endTime" | "minRouteTime" | "maxRouteTime" | "group" | "checkpoints" | "penalties">

export type AddGroup = Omit<Group, "id" | "finishTime" | "nextCheckpointId" | "route" | "disqualified" | "penalty" | "dnf">
