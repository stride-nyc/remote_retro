import React from "react"
import sinon from "sinon"
import { shallow, mount } from "enzyme"

import { GroupingStageIdeaCard } from "../../web/static/js/components/grouping_stage_idea_card"

describe("<GroupingStageIdeaCard />", () => {
  let wrapper
  let idea
  let styleProp

  describe("when the given idea has coordinates", () => {
    before(() => {
      idea = { id: 5, body: "hello", x: 0, y: 109 }
      wrapper = shallow(
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
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
  })

  describe("when the given idea *lacks* x and y attributes", () => {
    beforeEach(() => {
      idea = { id: 9, body: "goodbye" }
      wrapper = shallow(
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
        { disableLifecycleMethods: true }
      )
      styleProp = wrapper.prop("style")
    })

    it("applies no inline styling", () => {
      expect(styleProp).to.eql({})
    })
  })

  describe("when the given idea has explicit null values for x/y", () => {
    beforeEach(() => {
      idea = { id: 9, body: "goodbye", x: null, y: null }
      wrapper = shallow(
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
        { disableLifecycleMethods: true }
      )
      styleProp = wrapper.prop("style")
    })

    it("applies no inline styling", () => {
      expect(styleProp).to.eql({})
    })
  })

  describe("when the given idea is in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: true }
      wrapper = shallow(
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
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
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
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
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
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
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
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
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
        { disableLifecycleMethods: true }
      )
      styleProp = wrapper.prop("style")
    })

    it("adds a box shadow", () => {
      expect(styleProp.boxShadow).to.exist
    })
  })

  describe("when the given idea lacks a grouping id", () => {
    beforeEach(() => {
      idea = { id: 9 }
      wrapper = shallow(
        <GroupingStageIdeaCard idea={idea} actions={{}} />,
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
        <GroupingStageIdeaCard
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
          <GroupingStageIdeaCard
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
          <GroupingStageIdeaCard
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
