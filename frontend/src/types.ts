export interface Checkpoint {
    id: string,
    name: string
}

export interface RouteLimit {
    id: Number,
    min_route_time: Number,
    max_route_time: Number
}

export type NotificationState = {
    message: string,
    type: "error" | "success" | null
}