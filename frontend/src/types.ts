export type CheckpointType = "START" | "FINISH" | "INTERMEDIATE";

export type Checkpoint = {
  id: string;
  name: string;
  type: CheckpointType
}

export interface RouteLimit {
    id: number,
    min_route_time: number,
    max_route_time: number
}

export type NotificationState = {
    message: string,
    type: "error" | "success" | null
}

export interface penaltyState {
    id: number,
    time: number
}

export interface Group {
    id?: number,
    name: string,
    members: number,
    penalty: penaltyState[],
    disqualified: boolean,
}