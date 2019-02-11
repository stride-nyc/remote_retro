import React from "react"

import IdeaBoard from "../../web/static/js/components/idea_board"
import ColumnarBoardLayout from "../../web/static/js/components/columnar_board_layout"
import STAGES from "../../web/static/js/configs/stages"
import { CATEGORIES } from "../../web/static/js/configs/retro_configs"

const { IDEA_GENERATION, ACTION_ITEMS, CLOSED } = STAGES

describe("IdeaBoard component", () => {
  let ideaBoard
  const mockRetroChannel = { push: () => {}, on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    ideas: [],
    stage: IDEA_GENERATION,
    isTabletOrAbove: true,
    categories: CATEGORIES,
  }

  describe("when the stage is 'idea-generation'", () => {
    beforeEach(() => {
      ideaBoard = mountWithConnectedSubcomponents(
        <IdeaBoard {...defaultProps} stage={IDEA_GENERATION} />
      )
    })

    it("passes categories of happy, sad, and confused", () => {
      expect(categoriesPassedTo(ideaBoard)).to.eql(["happy", "sad", "confused"])
    })
  })

  describe("when the stage is 'action-items'", () => {
    beforeEach(() => {
      ideaBoard = mountWithConnectedSubcomponents(
        <IdeaBoard {...defaultProps} stage={ACTION_ITEMS} />
      )
    })

    it("passes an additional fourth category of action-items", () => {
      expect(categoriesPassedTo(ideaBoard)).to.eql(["happy", "sad", "confused", "action-item"])
    })
  })

  describe("when the stage is 'closed'", () => {
    beforeEach(() => {
      ideaBoard = mountWithConnectedSubcomponents(<IdeaBoard {...defaultProps} stage={CLOSED} />)
    })

    it("passes an additional fourth category of action-items", () => {
      expect(categoriesPassedTo(ideaBoard)).to.eql(["happy", "sad", "confused", "action-item"])
    })
  })
})

const categoriesPassedTo = ideaBoard => {
  const layout = ideaBoard.find(ColumnarBoardLayout)
  return layout.prop("categories")
}
