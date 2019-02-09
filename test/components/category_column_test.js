import React from "react"
import { spy } from "sinon"

import { buildIdeaDragEvent } from "../support/js/test_helper"
import { CategoryColumn, mapStateToProps } from "../../web/static/js/components/category_column"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("<CategoryColumn />", () => {
  let wrapper

  const defaultProps = {
    actions: {},
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
  }

  context("when an item is dropped upon it", () => {
    let actions

    const idea = {
      id: 100,
      body: "sup",
      category: "sad",
      assignee_id: null,
    }

    const mockEvent = buildIdeaDragEvent(idea)

    beforeEach(() => {
      actions = {
        submitIdeaEditAsync: spy(),
      }

      wrapper = mountWithConnectedSubcomponents(
        <CategoryColumn
          {...defaultProps}
          actions={actions}
        />
      )

      wrapper.simulate("dragEnter")
      wrapper.simulate("drop", mockEvent)
    })

    it("pushes an idea edit event, passing the column's 'category'", () => {
      expect(actions.submitIdeaEditAsync).calledWith({
        ...idea,
        category: "confused",
      })
    })
  })
})

describe("mapStateToProps", () => {
  context("when every idea passed in the ideas prop matches the column's category", () => {
    it("returns all of those ideas in the props", () => {
      const ideas = [{
        id: 1,
        body: "tests!",
        category: "happy",
      }, {
        id: 2,
        body: "winter break!",
        category: "happy",
      }]

      const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
      expect(resultingProps.ideas).to.deep.equal(ideas)
    })
  })

  context("when an idea passed in the ideas prop fails to match the column's category", () => {
    it("excludes that idea from the returned array of ideas passes as props", () => {
      const ideas = [{
        id: 1,
        body: "still no word on tests",
        category: "confused",
      }, {
        id: 2,
        body: "fassssst build",
        category: "happy",
      }]

      const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
      expect(resultingProps.ideas).to.deep.equal([{
        id: 2,
        body: "fassssst build",
        category: "happy",
      }])
    })
  })
})
