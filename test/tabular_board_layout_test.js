import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"

import { TabularBoardLayout } from "../web/static/js/components/tabular_board_layout"

describe("TabularBoardLayout component", () => {
  let wrapper

  const actions = {
    categoryTabSelected: sinon.spy(),
  }

  const defaultProps = {
    actions,
    categories: ["happy", "sad", "confused"],
    ideas: [],
    votes: [],
    selectedCategoryTab: "happy",
    retroChannel: {},
    stage: "idea-generation",
    currentUser: {},
  }

  describe("when clicking the tab for a given category", () => {
    beforeEach(() => {
      wrapper = shallow(<TabularBoardLayout {...defaultProps} />)
      wrapper.find(".sad.item").simulate("mousedown")
    })

    it("dispatches an action to the store, indicating category selection", () => {
      expect(actions.categoryTabSelected).to.have.been.calledWith("sad")
    })
  })
})
