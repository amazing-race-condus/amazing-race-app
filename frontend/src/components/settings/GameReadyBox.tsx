import { styles } from "@/styles/commonStyles"
import { View, Text } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { validateDistances } from "@/services/routeService"
import { useState, useEffect } from "react"
import GameStartItem from "./GameStartItem"

const GameReadyBox = (props: any) => {
  const event = useSelector((state: RootState) => state.event)
  const [validDistances, setValidDistances] = useState<boolean>(false)

  useEffect(() => {
    const checkDistances = async () => {
      const valid = await validateDistances(event.id)
      setValidDistances(valid)
    }
    checkDistances()
  }, [event.id, props.checkpoints])

  return (
    <View style={styles.statsCard}>
      <View style={styles.statTitle}>
        <FontAwesome5 name="list" size={20} color="#003366" />
        <Text style={styles.statTitle}> Pelin aloitus </Text>
        <FontAwesome5 name="check" size={20} color="#003366" />
      </View>
      <GameStartItem
        text="Lähtörasti"
        checkBoolean={props.start.length > 0}
      />
      <GameStartItem
        text="Maali"
        checkBoolean={props.finish.length > 0}
      />
      <GameStartItem
        text="Vähintään 4 välirastia"
        checkBoolean={props.intermediates.length > 3}
      />
      <GameStartItem
        text="Rastien etäisyydet määritetty"
        checkBoolean={validDistances}
      />
      <GameStartItem
        text="Vähintään yksi ryhmä"
        checkBoolean={props.groups.length > 0}
      />
      <GameStartItem
        text="Jokaisella ryhmällä on reitti"
        checkBoolean={props.groups.length > 0 && props.groups.length === props.groupRoutes.length}
      />
      <GameStartItem
        text="Kaikilla rasteilla on vihjeet"
        checkBoolean={props.hints && props.checkpoints.length > 0}
      />
      <GameStartItem
        text={`Ryhmiä merkitty aloittaneiksi ${props.startedGroups.length}/${props.groups.length}`}
        checkBoolean={props.startedGroups.length === props.groups.length && props.groups.length > 0}
      />
    </View>
  )
}

export default GameReadyBox
