import { styles } from "@/styles/commonStyles"
import { View, Text } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { validateDistances } from "@/services/routeService"
import { useState, useEffect } from "react"
import GameStartItem from "./GameStartItem"

const GameReadyBox = () => {
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const groups = useSelector((state: RootState) => state.groups)
  const event = useSelector((state: RootState) => state.event)
  const [validDistances, setValidDistances] = useState<boolean>(false)
  const [hints, setHints] = useState<boolean>(true)

  const start = checkpoints.filter(c => c.type === "START")
  const finish = checkpoints.filter(c => c.type === "FINISH")
  const intermediates = checkpoints.filter(c => c.type === "INTERMEDIATE")
  const groupRoutes = groups.filter(g => g.route.length > 0)
  const startedGroups = groups.filter(g => {
    if (!g.nextCheckpointId || !g.route) {
      return false
    }
    return g.nextCheckpointId !== g.route[0].id
  })

  useEffect(() => {
    const checkDistances = async () => {
      const valid = await validateDistances(event.id)
      setValidDistances(valid)
    }
    checkDistances()
  }, [event.id, checkpoints])

  useEffect(() => {
    for (const checkpoint of checkpoints) {
      if (checkpoint.hint === "" || checkpoint.easyHint === "") {
        setHints(false)
      }
    }
  }, [checkpoints])

  return (
    <View style={styles.statsCard}>
      <View style={styles.statTitle}>
        <FontAwesome5 name="list" size={20} color="#003366" />
        <Text style={styles.statTitle}> Pelin aloitus </Text>
        <FontAwesome5 name="check" size={20} color="#003366" />
      </View>
      <GameStartItem
        text="Lähtörasti"
        checkBoolean={start.length > 0}
      />
      <GameStartItem
        text="Maali"
        checkBoolean={finish.length > 0}
      />
      <GameStartItem
        text="Vähintään 4 välirastia"
        checkBoolean={intermediates.length > 3}
      />
      <GameStartItem
        text="Rastien etäisyydet määritetty"
        checkBoolean={validDistances}
      />
      <GameStartItem
        text="Vähintään yksi ryhmä"
        checkBoolean={groups.length > 0}
      />
      <GameStartItem
        text="Jokaisella ryhmällä on reitti"
        checkBoolean={groups.length > 0 && groups.length === groupRoutes.length}
      />
      <GameStartItem
        text="Kaikilla rasteilla on vihjeet"
        checkBoolean={hints}
      />
      <GameStartItem
        text={`Ryhmiä merkitty aloittaneiksi ${startedGroups.length}/${groups.length}`}
        checkBoolean={startedGroups.length === groups.length}
      />
    </View>
  )
}

export default GameReadyBox
