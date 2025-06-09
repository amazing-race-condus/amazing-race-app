import React from "react"
import { ScrollView, View, Text, Pressable } from "react-native"
import { Link, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"

const ResultsView = () => {
  //TODO: get real values
  //const eventId = 1
  const gameStarted = true
  const gameFinished = true

  if (!gameStarted)
    return <Text style={styles.breadText}>Peliä ei ole vielä aloitettu.</Text>

  if (!gameFinished)
    return <Text style={styles.breadText}>Peliä ei ole vielä päätetty.</Text>

  //TODO: get real groups
  const groups = [
    {
      "id": 6,
      "name": "Höhlät",
      "members": 5,
      "eventId": null,
      "finishTime": "2025-06-09T06:16:21.141Z",
      "nextCheckpointId": 3,
      "routeId": 556,
      "disqualified": false,
      "dnf": false,
      "easy": false,
      "penalty": [
        {
          "id": 2,
          "groupId": 6,
          "time": 5,
          "type": "OVERTIME",
          "checkpointId": 6,
          "eventId": null
        }
      ],
      "route": [
        {
          "id": 1,
          "name": "Katri Valan puisto",
          "type": "START",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 6,
          "name": "Oodi",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 3,
          "name": "Kulosaaren kenttä",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 7,
          "name": "Kisahalli",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 4,
          "name": "Katajanokka",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 8,
          "name": "Luonnontieteellinen museo",
          "type": "FINISH",
          "hint": null,
          "easyHint": null,
          "eventId": null
        }
      ]
    },
    {
      "id": 7,
      "name": "Mansikat",
      "members": 7,
      "eventId": null,
      "finishTime": null,
      "nextCheckpointId": 1,
      "routeId": 605,
      "disqualified": false,
      "dnf": false,
      "easy": true,
      "penalty": [],
      "route": [
        {
          "id": 1,
          "name": "Katri Valan puisto",
          "type": "START",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 7,
          "name": "Kisahalli",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 4,
          "name": "Katajanokka",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 6,
          "name": "Oodi",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 3,
          "name": "Kulosaaren kenttä",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 8,
          "name": "Luonnontieteellinen museo",
          "type": "FINISH",
          "hint": null,
          "easyHint": null,
          "eventId": null
        }
      ]
    },
    {
      "id": 5,
      "name": "Nimetön",
      "members": 4,
      "eventId": null,
      "finishTime": "2025-06-09T06:16:22.141Z",
      "nextCheckpointId": 1,
      "routeId": 445,
      "disqualified": false,
      "dnf": false,
      "easy": true,
      "penalty": [],
      "route": [
        {
          "id": 1,
          "name": "Katri Valan puisto",
          "type": "START",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 3,
          "name": "Kulosaaren kenttä",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 2,
          "name": "Johanneksenkirkko",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 6,
          "name": "Oodi",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 5,
          "name": "Lahnalahden puisto",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 8,
          "name": "Luonnontieteellinen museo",
          "type": "FINISH",
          "hint": null,
          "easyHint": null,
          "eventId": null
        }
      ]
    },
    {
      "id": 8,
      "name": "Kurikan nimipäivät",
      "members": 8,
      "eventId": null,
      "finishTime": null,
      "nextCheckpointId": 1,
      "routeId": 619,
      "disqualified": false,
      "dnf": false,
      "easy": true,
      "penalty": [],
      "route": [
        {
          "id": 1,
          "name": "Katri Valan puisto",
          "type": "START",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 7,
          "name": "Kisahalli",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 6,
          "name": "Oodi",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 3,
          "name": "Kulosaaren kenttä",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 5,
          "name": "Lahnalahden puisto",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 8,
          "name": "Luonnontieteellinen museo",
          "type": "FINISH",
          "hint": null,
          "easyHint": null,
          "eventId": null
        }
      ]
    },
    {
      "id": 1,
      "name": "Pöpöilijät",
      "members": 6,
      "eventId": null,
      "finishTime": null,
      "nextCheckpointId": 1,
      "routeId": 539,
      "disqualified": false,
      "dnf": false,
      "easy": true,
      "penalty": [],
      "route": [
        {
          "id": 1,
          "name": "Katri Valan puisto",
          "type": "START",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 5,
          "name": "Lahnalahden puisto",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 7,
          "name": "Kisahalli",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 4,
          "name": "Katajanokka",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 6,
          "name": "Oodi",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 8,
          "name": "Luonnontieteellinen museo",
          "type": "FINISH",
          "hint": null,
          "easyHint": null,
          "eventId": null
        }
      ]
    },
    {
      "id": 14,
      "name": "Toimiiko kaikki",
      "members": 6,
      "eventId": null,
      "finishTime": null,
      "nextCheckpointId": null,
      "routeId": null,
      "disqualified": false,
      "dnf": false,
      "easy": true,
      "penalty": [],
      "route": []
    },
    {
      "id": 9,
      "name": "Penat",
      "members": 4,
      "eventId": null,
      "finishTime": null,
      "nextCheckpointId": 6,
      "routeId": 621,
      "disqualified": false,
      "dnf": false,
      "easy": false,
      "penalty": [
        {
          "id": 1,
          "groupId": 9,
          "time": 5,
          "type": "OVERTIME",
          "checkpointId": 7,
          "eventId": null
        }
      ],
      "route": [
        {
          "id": 1,
          "name": "Katri Valan puisto",
          "type": "START",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 7,
          "name": "Kisahalli",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 6,
          "name": "Oodi",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 4,
          "name": "Katajanokka",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 5,
          "name": "Lahnalahden puisto",
          "type": "INTERMEDIATE",
          "hint": null,
          "easyHint": null,
          "eventId": null
        },
        {
          "id": 8,
          "name": "Luonnontieteellinen museo",
          "type": "FINISH",
          "hint": null,
          "easyHint": null,
          "eventId": null
        }
      ]
    }
  ]

  const passedGroups = groups.filter(group => group.finishTime)

  return (
    <View>
      {passedGroups.map((group, i)=>
        <Link
          key={group.routeId}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <Pressable style={styles.item}>
            <Text>{i+1}.</Text>
            <Text>{group.name}</Text>
            <Text style={{ color: "gray" }}>5 t 20 min</Text>
          </Pressable>
        </Link>)}
    </View>
  )
}

const Results = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.header}>Tulokset</Text>
        <ResultsView />
      </ScrollView>
    </View>
  )
}

export default Results
