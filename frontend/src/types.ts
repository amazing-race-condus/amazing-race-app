export interface Checkpoint {
    id: string,
    name: string,
    type: string
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

export type Group = {
    id: string,
    name: string,
}