import React from "react"
import { shallow } from "enzyme"

import Room from "../../web/static/js/components/room"
import LobbyStage from "../../web/static/js/components/lobby_stage"
import PrimeDirectiveStage from "../../web/static/js/components/prime_directive_stage"
import IdeaGenerationStage from "../../web/static/js/components/idea_generation_stage"
import GroupingStage from "../../web/static/js/components/grouping_stage"
import GroupNamingStage from "../../web/static/js/components/group_naming_stage"
import STAGES from "../../web/static/js/configs/stages"

const { LOBBY, PRIME_DIRECTIVE, IDEA_GENERATION, GROUPING, GROUP_NAMING } = STAGES

describe("Room", () => {
  let room
  const defaultProps = {
    presences: [{
      given_name: "treezy",
      online_at: 803,
      picture: "http://herpderp.com",
    }],
    ideas: [],
    groups: [],
    facilitatorName: "Dirk",
    stageConfig: {},
    currentUser: { is_facilitator: false, token: "33ndk" },
    actions: {},
    browser: {},
    userOptions: {},
  }

  describe("when the stage is lobby", () => {
    it("renders the LobbyStage", () => {
      room = shallow(
        <Room
          {...defaultProps}
          stage={LOBBY}
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
          {...defaultProps}
          stage={PRIME_DIRECTIVE}
        />
      )
      const primeDirectiveStage = room.find(PrimeDirectiveStage)

      expect(primeDirectiveStage).to.have.length(1)
    })
  })

  describe("when the stage is grouping", () => {
    it("renders the GroupingStage", () => {
      room = shallow(
        <Room
          {...defaultProps}
          stage={GROUPING}
        />
      )

      const groupingStage = room.find(GroupingStage)

      expect(groupingStage).to.have.length(1)
    })
  })

  describe("when the stage is group naming", () => {
    it("renders the GroupNamingStage", () => {
      room = shallow(
        <Room
          {...defaultProps}
          stage={GROUP_NAMING}
        />
      )

      const groupNamingStage = room.find(GroupNamingStage)

      expect(groupNamingStage).to.have.length(1)
    })
  })

  describe("when the stage is not lobby or prime-directive", () => {
    it("renders the IdeaGenerationStage", () => {
      room = shallow(
        <Room
          {...defaultProps}
          stage={IDEA_GENERATION}
        />
      )
      const ideaGenerationStage = room.find(IdeaGenerationStage)

      expect(ideaGenerationStage).to.have.length(1)
    })
  })
})
