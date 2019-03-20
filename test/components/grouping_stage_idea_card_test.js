import React from "react"
import { shallow } from "enzyme"

import { GroupingStageIdeaCard } from "../../web/static/js/components/grouping_stage_idea_card"

describe("<GroupingStageIdeaCard />", () => {
  let wrapper
  let idea
  let styleProp

  describe("when the given idea has x and y attributes", () => {
    before(() => {
      idea = { id: 5, body: "hello", x: 53, y: 109 }
      wrapper = shallow(<GroupingStageIdeaCard idea={idea} />)
      styleProp = wrapper.prop("style")
    })

    it("applies fixed position inline styling", () => {
      expect(styleProp.position).to.eql("fixed")
    })

    it("zeroes out the top attribute", () => {
      expect(styleProp.top).to.eql(0)
    })

    it("zeroes out the left attribute", () => {
      expect(styleProp.left).to.eql(0)
    })

    it("maps the x/y values to transform: translate", () => {
      expect(styleProp.transform).to.eql("translate(53px,109px)")
    })
  })

  describe("when the given idea *lacks* x and y attributes", () => {
    beforeEach(() => {
      idea = { id: 9, body: "goodbye" }
      wrapper = shallow(<GroupingStageIdeaCard idea={idea} />)
      styleProp = wrapper.prop("style")
    })

    it("applies no inline styling", () => {
      expect(styleProp).to.eql({})
    })
  })
})
