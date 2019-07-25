import React from "react"
import { shallow } from "enzyme"

import { GroupingStageIdeaCard } from "../../web/static/js/components/grouping_stage_idea_card"

describe("<GroupingStageIdeaCard />", () => {
  let wrapper
  let idea
  let styleProp

  describe("when the given idea has coordinates", () => {
    before(() => {
      idea = { id: 5, body: "hello", x: 0, y: 109 }
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
      expect(styleProp.transform).to.eql("translate(0px,109px)")
    })

    it("maps the x/y values to WebkitTransform: translate", () => {
      expect(styleProp.WebkitTransform).to.eql("translate(0px,109px)")
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

  describe("when the given idea has explicit null values for x/y", () => {
    beforeEach(() => {
      idea = { id: 9, body: "goodbye", x: null, y: null }
      wrapper = shallow(<GroupingStageIdeaCard idea={idea} />)
      styleProp = wrapper.prop("style")
    })

    it("applies no inline styling", () => {
      expect(styleProp).to.eql({})
    })
  })

  describe("when the given idea is in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: true }
      wrapper = shallow(<GroupingStageIdeaCard idea={idea} />)
      styleProp = wrapper.prop("style")
    })

    it("appears ghosted out", () => {
      expect(styleProp.opacity).to.be.below(1)
    })
  })

  describe("when the given idea is *not* in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: false }
      wrapper = shallow(<GroupingStageIdeaCard idea={idea} />)
      styleProp = wrapper.prop("style")
    })

    it("makes no change to opacity", () => {
      expect(styleProp.opacity).to.be.an("undefined")
    })
  })
})
