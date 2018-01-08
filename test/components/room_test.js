import React from "react"
import { shallow } from "enzyme"

import Room from "../../web/static/js/components/room"
import LobbyStage from "../../web/static/js/components/lobby_stage"
import PrimeDirectiveStage from "../../web/static/js/components/prime_directive_stage"
import IdeaGenerationStage from "../../web/static/js/components/idea_generation_stage"
import STAGES from "../../web/static/js/configs/stages"

const { LOBBY, PRIME_DIRECTIVE, IDEA_GENERATION } = STAGES

describe("Room", () => {
  let room
  const users = [{
    given_name: "treezy",
    online_at: 803,
    picture: "http://herpderp.com",
  }]

  describe("when the stage is lobby", () => {
    it("renders the LobbyStage", () => {
      room = shallow(
        <Room
          stage={LOBBY}
          users={users}
        />
      )
      const lobbyStage = room.find(LobbyStage)

      expect(lobbyStage).to.have.length(1)
    })
  })

  describe("when the stage is prime-directive", () => {
    it("renders the PrimeDirectiveStage", () => {
      room = shallow(
        <Room
          stage={PRIME_DIRECTIVE}
          users={users}
        />
      )
      const primeDirectiveStage = room.find(PrimeDirectiveStage)

      expect(primeDirectiveStage).to.have.length(1)
    })
  })

  describe("when the stage is not lobby or prime-directive", () => {
    it("renders the IdeaGenerationStage", () => {
      room = shallow(
        <Room
          stage={IDEA_GENERATION}
          users={users}
          ideas={[]}
          retroChannel={{}}
        />
      )
      const ideaGenerationStage = room.find(IdeaGenerationStage)

      expect(ideaGenerationStage).to.have.length(1)
    })
  })
})
