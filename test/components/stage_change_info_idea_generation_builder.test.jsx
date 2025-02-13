import React from "react"
import { shallow } from "enzyme"

import stageChangeInfoIdeaGenerationBuilder from "../../web/static/js/components/stage_change_info_idea_generation_builder" // eslint-disable-line line-length

describe("stageChangeInfoIdeaGenerationBuilder", () => {
  it("returns a renderable React component with list", () => {
    const Result = stageChangeInfoIdeaGenerationBuilder([])
    const wrapper = shallow(<Result />)

    expect(wrapper.find("ul")).length.to.be.above(0)
  })

  context("and there are no ideas given to the builder", () => {
    it("renders no list items", () => {
      const Result = stageChangeInfoIdeaGenerationBuilder([])
      const wrapper = shallow(<Result />)

      expect(wrapper.find("li")).to.have.length(0)
    })
  })

  context("and several ideas are given to the builder", () => {
    it("renders no list items", () => {
      const ideas = ["hey", "howdy", "who"]

      const Result = stageChangeInfoIdeaGenerationBuilder(ideas)
      const wrapper = shallow(<Result />)

      expect(wrapper.find("li")).to.have.length(3)
    })
  })
})
