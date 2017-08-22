import React from "react"
import { shallow } from "enzyme"

import IdeaBoard from "../../web/static/js/components/idea_board"
import CategoryColumn from "../../web/static/js/components/category_column"

describe("IdeaBoard component", () => {
  let ideaBoard
  const mockRetroChannel = { push: () => {}, on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: "idea-generation",
  }

  describe("when the stage is 'idea-generation'", () => {
    before(() => {
      ideaBoard = shallow(<IdeaBoard {...defaultProps} stage="idea-generation" />)
    })

    it("renders columns for happy, sad, and confused ideas", () => {
      expect(categoriesRendered(ideaBoard)).to.eql(["happy", "sad", "confused"])
    })
  })

  describe("when the stage is 'action-items'", () => {
    before(() => {
      ideaBoard = shallow(<IdeaBoard {...defaultProps} stage="action-items" />)
    })

    it("renders a fourth column for displaying the action-items", () => {
      expect(categoriesRendered(ideaBoard)).to.eql(["happy", "sad", "confused", "action-item"])
    })
  })

  describe("when the stage is 'closed'", () => {
    before(() => {
      ideaBoard = shallow(<IdeaBoard {...defaultProps} stage="closed" />)
    })

    it("renders a fourth column for displaying the action-items", () => {
      expect(categoriesRendered(ideaBoard)).to.eql(["happy", "sad", "confused", "action-item"])
    })
  })
})

const categoriesRendered = ideaBoard => {
  const categoryColumns = ideaBoard.find(CategoryColumn)
  return categoryColumns.map(column => (column.prop("category")))
}
