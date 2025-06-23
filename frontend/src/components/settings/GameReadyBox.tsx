import { styles } from "@/styles/commonStyles"
import { View, Text } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { GameStartItem } from "./GameStartItem"

const GameReadyBox = (props: any) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statTitle}>
        <FontAwesome5 name="list" size={20} color="#003366" />
        <Text style={styles.statTitle}> Pelin aloitus </Text>
        <FontAwesome5 name="check" size={20} color="#003366" />
      </View>
      <View style={styles.statTitle}>
        <Text style={styles.statTitle}>Pakolliset </Text>
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
        checkBoolean={props.validDistances}
      />
      <GameStartItem
        text="Vähintään yksi ryhmä"
        checkBoolean={props.groups.length > 0}
      />
      <GameStartItem
        text="Jokaisella ryhmällä on reitti"
        checkBoolean={props.groups.length > 0 && props.groups.length === props.groupRoutes.length}
      />
      <View style={styles.statTitle}>
        <Text style={styles.statTitle}>Suositellut </Text>
      </View>
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
