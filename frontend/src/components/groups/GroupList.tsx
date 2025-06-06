import { FlatList } from "react-native-gesture-handler"
import GroupItem from "./GroupItem"
import type { Group } from "@/types"

const GroupList = ({ groups }: { groups: Group[] }) => {
  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <GroupItem
          group={item}
        />
      )}
    />
  )
}

export default GroupList
