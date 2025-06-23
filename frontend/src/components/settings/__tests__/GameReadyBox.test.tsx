import { render, screen } from "@testing-library/react-native"
import GameReadyBox from "../GameReadyBox"
import { listCheckpoints, groups } from "@/utils/testUtils"

describe("GameReadyBox", () => {
  test("Renders title", () => {
    render(
      <GameReadyBox
        checkpoints={listCheckpoints}
        groups={groups}
        start={listCheckpoints.filter(c => c.type === "START")}
        finish={listCheckpoints.filter(c => c.type === "FINISH")}
        intermediates={listCheckpoints.filter(c => c.type === "INTERMEDIATE")}
        hints={true}
        groupRoutes={groups.filter(g => g.route.length > 0)}
        startedGroups={[]}
        validDistances={true}
      />
    )

    expect(screen.getByText("Pelin aloitus")).toBeTruthy()
  })

  test("Renders required and optional subtitles", () => {
    render(
      <GameReadyBox
        checkpoints={listCheckpoints}
        groups={groups}
        start={listCheckpoints.filter(c => c.type === "START")}
        finish={listCheckpoints.filter(c => c.type === "FINISH")}
        intermediates={listCheckpoints.filter(c => c.type === "INTERMEDIATE")}
        hints={true}
        groupRoutes={groups.filter(g => g.route.length > 0)}
        startedGroups={[]}
        validDistances={true}
      />
    )

    expect(screen.getByText("Pakolliset")).toBeTruthy()
    expect(screen.getByText("Suositellut")).toBeTruthy()
  })
})
