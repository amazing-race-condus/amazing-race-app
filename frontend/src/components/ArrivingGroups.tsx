import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { styles } from "@/styles/commonStyles"
import React, { useEffect, useState } from "react"
import { getArrivingGroups } from "@/services/groupService"
import { Group } from "@/types" //?
import { Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"

const GroupItem = ({ name, members, id }: { name: string; members: number; id: string }) => {
  //copied from Groups component
  return (
    <Link
      href={{
        pathname: `/(groups)/group/${id}`,
        params: { name, members }
      }}
      asChild
    >
      <TouchableOpacity style={styles.item}>
        <Text style={styles.checkpointName}>{name}</Text>
        <Entypo name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    </Link>
  )
}

const ArrivingGroups = ({ checkpointId = 1}) => {
  const [arrivingGroups, setArrivingGroups] = useState<Group[]>([])

  useEffect(() => {
    const fetchArrivingGroups = async() => {
      try {
        const newArrivingGroups = await getArrivingGroups(checkpointId)
        setArrivingGroups(newArrivingGroups)
      } catch (error) {
        console.log("A problem with fetching arriving groups:", error)
      }
    }
    fetchArrivingGroups()
  }, [])

  return (
    <View>
      <Text style={[styles.header, {textAlign: "center"}]}>Saapuvat ryhmät</Text>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.listcontainer}>
          {arrivingGroups.map((group) => (
            <View key={group.id}>
              <GroupItem name={group.name} members={4} id={group.id?.toString() ?? ""} />
            </View>
          ))}
          { (arrivingGroups.length === 0) && <Text style={[styles.breadText, {textAlign: "center"}]}>Ei saapuvia ryhmiä.</Text> }
        </View>
      </ScrollView>
    </View>
  )

}

export default ArrivingGroups
