export interface Checkpoint {
    id: string,
    name: string
}

export type NotificationState = {
    message: string,
    type: "error" | "success" | null
}