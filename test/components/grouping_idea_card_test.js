import React from "react"
import sinon from "sinon"
import { shallow, mount } from "enzyme"

import { GroupingIdeaCard } from "../../web/static/js/components/grouping_idea_card"
import { COLLISION_BUFFER } from "../../web/static/js/services/collisions"

describe("<GroupingIdeaCard />", () => {
  let wrapper
  let idea
  let styleProp
  const defaultProps = {
    idea: {},
    actions: {},
    userOptions: {},
  }

  describe("when the given idea has coordinates", () => {
    before(() => {
      idea = { id: 5, body: "hello", x: 0, y: 109 }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
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

    it("applies no margin", () => {
      const marginDeclarations = Object.keys(styleProp).filter(style => (style.match(/margin/i)))
      expect(marginDeclarations).to.be.empty
    })
  })

  describe("when the given idea *lacks* x and y attributes", () => {
    beforeEach(() => {
      idea = { id: 9, body: "goodbye", x: null, y: null }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
      styleProp = wrapper.prop("style")
    })

    it("adds margins to the top and right, but not the left or the bottom", () => {
      const marginDeclaration = styleProp.margin

      expect(marginDeclaration).to.match(/\d+px \d+px 0 0/i)
    })

    it("applies a top and right margin greater than the collision buffer to avoid collisions registering on load", () => {
      const marginDeclaration = styleProp.margin

      const topAndRightMargins = marginDeclaration.match(/\d+/g).map(Number).slice(0, 2)

      expect(topAndRightMargins).to.satisfy(marginsArray => {
        return marginsArray.every(margin => margin > COLLISION_BUFFER)
      })
    })
  })

  describe("when the given idea is in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: true }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
    })

    it("applies a class for styling the edit state", () => {
      expect(wrapper.find(".in-edit-state")).to.have.length(1)
    })
  })

  describe("when the given idea is *not* in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: false }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
    })

    it("does *not* apply a class for styling the edit state", () => {
      expect(wrapper.find(".in-edit-state")).to.have.length(0)
    })
  })

  describe("when an idea database update is in flight", () => {
    beforeEach(() => {
      idea = { id: 9, editSubmitted: true }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
    })

    it("displays a loader", () => {
      expect(wrapper.find(".loader")).to.have.length(1)
    })
  })

  describe("when an idea database update is *not* in flight", () => {
    beforeEach(() => {
      idea = { id: 9, editSubmitted: false }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
    })

    it("does not display a loader", () => {
      expect(wrapper.find(".loader")).to.have.length(0)
    })
  })

  describe("when the given idea has a grouping id", () => {
    beforeEach(() => {
      idea = { id: 9, ephemeralGroupingId: 15 }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
      styleProp = wrapper.prop("style")
    })

    it("adds a box shadow", () => {
      expect(styleProp.boxShadow).to.exist
    })

    describe("the box shadow color", () => {
      it("gets set to black(#000000) when highContrastOn is true", () => {
        wrapper.setProps({ userOptions: { highContrastOn: true } })
        const { boxShadow } = wrapper.prop("style")

        expect(boxShadow).to.contain("#000000")
      })

      it("does not get set to black(#000000) when highContrastOn is false", () => {
        wrapper.setProps({ userOptions: { highContrastOn: false } })
        const { boxShadow } = wrapper.prop("style")

        expect(boxShadow).to.not.contain("#000000")
      })

      it("changes when given a different ephmeral grouping id", () => {
        const boxShadowBefore = styleProp.boxShadow

        wrapper.setProps({ idea: { id: 9, ephemeralGroupingId: 11 } })
        const boxShadowAfter = wrapper.prop("style").boxShadow


        expect(boxShadowBefore).to.not.eql(boxShadowAfter)
      })

      it("does not change when given the same ephmeral grouping id", () => {
        const boxShadowBefore = styleProp.boxShadow

        wrapper.setProps({ idea: { id: 9, ephemeralGroupingId: 15 } })
        const boxShadowAfter = wrapper.prop("style").boxShadow


        expect(boxShadowBefore).to.eql(boxShadowAfter)
      })
    })
  })

  describe("when the given idea lacks a grouping id", () => {
    beforeEach(() => {
      idea = { id: 9 }
      wrapper = shallow(
        <GroupingIdeaCard {...defaultProps} idea={idea} />,
        { disableLifecycleMethods: true }
      )
      styleProp = wrapper.prop("style")
    })

    it("no box shadow is applied", () => {
      expect(styleProp.boxShadow).to.not.exist
    })
  })

  describe("on mount", () => {
    let actions

    beforeEach(() => {
      idea = { id: 54 }
      actions = {
        updateIdea: sinon.spy(),
      }
      wrapper = mount(
        <GroupingIdeaCard
          {...defaultProps}
          idea={idea}
          actions={actions}
          connectDragPreview={node => node}
        />
      )
    })

    it("dispatches an action to the store, updating the idea with height/width/x/y", () => {
      expect(actions.updateIdea).to.have.been.calledWithMatch(idea.id, {
        height: 0,
        width: 0,
        x: undefined,
        y: undefined,
      })
    })
  })

  describe("when updated", () => {
    let actions
    let updatedProps

    describe("and the given idea explicitly *lacks* a height and width", () => {
      beforeEach(() => {
        idea = { id: 54, height: undefined, width: undefined }

        actions = {
          updateIdea: () => {},
        }

        wrapper = mount(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            actions={actions}
            connectDragPreview={node => node}
          />
        )

        // ensure spy is fresh so that it doesn't get triggered on mount call
        updatedProps = {
          actions: { updateIdea: sinon.spy() },
          idea,
        }

        wrapper.setProps(updatedProps)
      })

      it("dispatches an action to the store, updating the idea with height & width", () => {
        const { updateIdea } = updatedProps.actions
        expect(updateIdea).to.have.been.calledWithMatch(idea.id, {
          height: 0,
          width: 0,
          x: undefined,
          y: undefined,
        })
      })
    })

    describe("and the new idea explicitly has numeric height + width", () => {
      beforeEach(() => {
        idea = { id: 54, height: 2, width: 2 }

        actions = {
          updateIdea: () => {},
        }

        wrapper = mount(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            actions={actions}
            connectDragPreview={node => node}
          />
        )

        // ensure spy is fresh so that it doesn't get triggered on mount call
        updatedProps = {
          actions: { updateIdea: sinon.spy() },
          idea,
        }

        wrapper.setProps(updatedProps)
      })

      it("does not dispatch an update idea action to the store", () => {
        const { updateIdea } = updatedProps.actions
        expect(updateIdea).to.not.have.been.called
      })
    })
  })
})
