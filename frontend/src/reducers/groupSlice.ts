import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "@/store/store"
import { getAllGroups } from "@/services/groupService"
import { setNotification } from "./responseSlice"
import { AxiosError } from "axios"
import { useRouter } from "expo-router"

export interface groupState {
    id : string,
    name : string
}

const initialState: groupState[] = [
  {
    id: "idfs",
    name: "IcedLimeTeam"
  },
  {
    id: "diafs",
    name: "NooobydoobyTeam"
  },
]

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<groupState[]>) {
      return action.payload
    },
    appendGroup(state, action: PayloadAction<groupState>) {
      state.push(action.payload)
    }
  },
})

export const fetchGroups = () => async (dispatch: AppDispatch) => {
  try {
    const allGroups = await getAllGroups()
    dispatch(setGroups(allGroups))
  } catch (error) {
    console.error("Failed to fetch groups:", error)
  }
}

export const { setGroups , appendGroup } = groupSlice.actions
export default groupSlice.reducer