import { FlatList } from "react-native-gesture-handler"
import GroupItem from "./GroupItem"
import type { Group } from "@/types"

const GroupList = ({ groups, onEditGroup }: { groups: Group[], onEditGroup?: (group: Group) => void }) => {
  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <GroupItem
          group={item}
          onEditGroup={onEditGroup}
        />
      )}
    />
  )
}

export default GroupList
