import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "@/store/store"
import { startGame, endGame , getEvent } from "@/services/eventService"
import { setNotification } from "./notificationSlice"
import type { User } from "@/types"

const initialState: User = {
  id: 0,
  token: "",
  username: "",
  admin: false
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload
    }
  },
})

// export const getEventReducer = (id: number) => async (dispatch: AppDispatch) => {
//   try {
//     const event = await getEvent(id)
//     dispatch(setEvents(event))
//   } catch (error) {
//     console.error("Failed to fetch event:", error)
//     dispatch(setNotification("Tapahtuman haku epäonnistui", "error"))
//   }
// }

// export const setStartReducer = (id : number) => async (dispatch: AppDispatch) => {
//   try {
//     const updatedEvent = await startGame(id)
//     const time = new Date(updatedEvent.startTime!)
//     const datetext = time.toTimeString().split(" ")[0].split(":")
//     const hours = datetext[0]
//     const minutes = datetext[1]
//     dispatch(setEvents(updatedEvent))
//     dispatch(setNotification(`Peli aloitettu ${hours}:${minutes}`, "success"))
//   } catch (error) {
//     console.error("Failed to start the game:", error)
//     dispatch(setNotification("Pelin aloitus epäonnistui", "error"))
//   }
// }

// export const setEndReducer = (id : number) => async (dispatch: AppDispatch) => {
//   try {
//     const updatedEvent = await endGame(id)
//     const time = new Date(updatedEvent.endTime!)
//     const datetext = time.toTimeString().split(" ")[0].split(":")
//     const hours = datetext[0]
//     const minutes = datetext[1]
//     dispatch(setEvents(updatedEvent))
//     dispatch(setNotification(`Peli päätetty ${hours}:${minutes}`, "success"))
//   } catch (error) {
//     console.error("Failed to end the game:", error)
//     dispatch(setNotification("Pelin päätös epäonnistui", "error"))
//   }
// }

export const { setUser } = userSlice.actions
export default userSlice.reducer
