import React from "react"
import { shallow } from "enzyme"

import Room from "../../web/static/js/components/room"
import PrimeDirective from "../../web/static/js/components/prime_directive"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"
import IdeaBoard from "../../web/static/js/components/idea_board"

describe("Room", () => {
  let room
  const users = [{
    given_name: "treezy",
    online_at: 803,
    picture: "http://herpderp.com",
  }]
  describe("when the stage is prime-directive", () => {
    room = shallow(
      <Room
        stage="prime-directive"
        users={users}
      />
    )

    it("renders the PrimeDirective", () => {
      const primeDirective = room.find(PrimeDirective)

      expect(primeDirective).to.have.length(1)
    })

    describe("and the user is the facilitator", () => {
      room = shallow(
        <Room
          stage="prime-directive"
          users={users}
          currentUser={{ is_facilitator: true }}
          retroChannel={{}}
        />
      )

      it("renders the StageProgressionButton", () => {
        const stageProgressionButton = room.find(StageProgressionButton)

        expect(stageProgressionButton).to.have.length(1)
      })
    })

    describe("and the user is not the facilitator", () => {
      const roomWithoutFacilitator = shallow(
        <Room
          stage="prime-directive"
          users={users}
        />
      )

      it("doesn't render the StageProgressionButton", () => {
        const stageProgressionButton = roomWithoutFacilitator.find(StageProgressionButton)

        expect(stageProgressionButton).to.have.length(0)
      })
    })
  })

  describe("when the stage is not prime-directive", () => {
    const ideaRoom = shallow(
      <Room
        stage="idea-generation"
        users={users}
        ideas={[]}
        retroChannel={{}}
      />
    )

    it("renders the IdeaBoard", () => {
      const ideaBoard = ideaRoom.find(IdeaBoard)

      expect(ideaBoard).to.have.length(1)
    })
  })
})
