import { FlatList } from "react-native-gesture-handler"
import GroupItem from "./GroupItem"

const GroupList = ({ groups = [{id: 0, name: "", members: 0}] }) => {
  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <GroupItem
          name={item.name}
          members={item.members}
          id={item.id?.toString()}
        />
      )}
    />
  )
}

export default GroupList
