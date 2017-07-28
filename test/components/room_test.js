import React from "react"
import { shallow } from "enzyme"

import Room from "../../web/static/js/components/room"
import PrimeDirectiveStage from "../../web/static/js/components/prime_directive_stage"
import IdeaGenerationStage from "../../web/static/js/components/idea_generation_stage"

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

    it("renders the PrimeDirectiveStage", () => {
      const primeDirectiveStage = room.find(PrimeDirectiveStage)

      expect(primeDirectiveStage).to.have.length(1)
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

    it("renders the IdeaGenerationStage", () => {
      const ideaGenerationStage = ideaRoom.find(IdeaGenerationStage)

      expect(ideaGenerationStage).to.have.length(1)
    })
  })
})
