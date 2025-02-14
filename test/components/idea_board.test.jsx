import React from "react"

import IdeaBoard from "../../web/static/js/components/idea_board"
import ColumnarBoardLayout from "../../web/static/js/components/columnar_board_layout"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, ACTION_ITEMS, CLOSED } = STAGES

describe("IdeaBoard component", () => {
  let ideaBoard
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    ideas: [],
    stage: IDEA_GENERATION,
    isTabletOrAbove: true,
    ideaGenerationCategories: ["one", "two", "three"],
  }

  describe("when the stage is 'idea-generation'", () => {

    
    beforeEach(() => {
      ideaBoard = mountWithConnectedSubcomponents(
        <IdeaBoard {...defaultProps} stage={IDEA_GENERATION} />
      )
    })

    it("passes the given idea generation categories to its layout component", () => {
      expect(categoriesPassedToInnerLayout(ideaBoard)).to.eql(["one", "two", "three"])
    })
  })

  describe("when the stage is 'action-items'", () => {
    beforeEach(() => {
      ideaBoard = mountWithConnectedSubcomponents(
        <IdeaBoard {...defaultProps} stage={ACTION_ITEMS} />
      )
    })

    it("passes an additional fourth category of action-items", () => {
      expect(categoriesPassedToInnerLayout(ideaBoard)).to.eql(["one", "two", "three", "action-item"])
    })
  })

  describe("when the stage is 'closed'", () => {
    beforeEach(() => {
      ideaBoard = mountWithConnectedSubcomponents(<IdeaBoard {...defaultProps} stage={CLOSED} />)
    })

    it("passes an additional fourth category of action-items", () => {
      expect(categoriesPassedToInnerLayout(ideaBoard)).to.eql(["one", "two", "three", "action-item"])
    })
  })
})

const categoriesPassedToInnerLayout = ideaBoard => {
  const layout = ideaBoard.find(ColumnarBoardLayout)
  return layout.prop("categories")
}
