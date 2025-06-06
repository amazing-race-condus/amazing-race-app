import { getType, sortCheckpoints } from "../checkpointUtils"
import { listCheckpoints } from "../testUtils"

describe("getType returns correct string back:", () => {
  test("'START' should return 'Lähtö'", () => {
    const result: string = getType("START")
    expect(result).toBe("Lähtö")
  })

  test("'FINISH' should return 'Maali'", () => {
    const result: string = getType("FINISH")
    expect(result).toBe("Maali")
  })

  test("'INTERMEDIATE' should return empty string", () => {
    const result: string = getType("INTERMEDIATE")
    expect(result).toBe("")
  })
})

describe("sortCheckpoints returns checkpoints in correct order:", () => {
  test("result should be correct length", () => {
    const result = sortCheckpoints(listCheckpoints)
    expect(result.length).toBe(listCheckpoints.length)
  })

  test("result should have correct order", () => {
    const result = sortCheckpoints(listCheckpoints)
    expect(result).toStrictEqual(
      [
        {
          id: 123987123,
          name: "Saharan aavikko",
          type: "START",
          eventId: 1,
          hint: null,
          easyHint: null
        },
        {
          id: 123987123,
          name: "Kalasatama",
          type: "FINISH",
          eventId: 1,
          hint: null,
          easyHint: null
        },
        {
          id: 2937418,
          name: "Kumpula",
          type: "INTERMEDIATE",
          eventId: 1,
          hint: null,
          easyHint: null
        },
        {
          id: 123987123,
          name: "Mongolian erämää",
          type: "INTERMEDIATE",
          eventId: 1,
          hint: null,
          easyHint: null
        },
        {
          id: 436780235746,
          name: "Oodi",
          type: "INTERMEDIATE",
          eventId: 1,
          hint: null,
          easyHint: null
        }
      ]
    )
  })
})
