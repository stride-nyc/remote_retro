import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"
import _ from "lodash"

import { GroupingBoard } from "../../web/static/js/components/grouping_board"
import GroupingIdeaCard from "../../web/static/js/components/grouping_idea_card"
import DragCoordinates from "../../web/static/js/services/drag_coordinates"

const requireUncached = module => {
  delete require.cache[require.resolve(module)]
  // eslint-disable-next-line
  return require(module)
}

describe("GroupingBoard", () => {
  const defaultProps = {
    ideas: [],
    actions: {},
    userOptions: {},
  }

  context("when there are no ideas to render", () => {
    it("renders no idea cards", () => {
      const wrapper = shallow(
        <GroupingBoard {...defaultProps} ideas={[]} />
      )

      expect(wrapper.find(GroupingIdeaCard)).to.have.length(0)
    })
  })

  context("when there are ideas to render", () => {
    context("when the ideas are of equal length", () => {
      it("renders an idea for each card, sorted by id asc", () => {
        const wrapper = shallow(
          <GroupingBoard {...defaultProps} ideas={[{ body: "hey", id: 6 }, { body: "you", id: 5 }]} />
        )

        const renderedIdeaIds = wrapper.find(GroupingIdeaCard).map(ideaCard => ideaCard.prop("idea").id)
        expect(renderedIdeaIds).to.eql([5, 6])
      })
    })

    context("when the idea bodies are of differing length", () => {
      it("renders the ideas by body length descending", () => {
        const wrapper = shallow(
          <GroupingBoard
            {...defaultProps}
            ideas={[{
              id: 6,
              body: "hi",
            }, {
              id: 5,
              body: "howdy",
            }, {
              id: 7,
              body: "hey",
            }]}
          />
        )

        const renderedIdeaIds = wrapper.find(GroupingIdeaCard).map(ideaCard => ideaCard.prop("idea").id)
        expect(renderedIdeaIds).to.eql([5, 7, 6])
      })
    })

    context("when there are more than 35 ideas", () => {
      let wrapper
      const ideas = []

      beforeEach(() => {
        _.times(36, n => {
          ideas.push({ id: n, body: "fart" })
        })

        wrapper = shallow(<GroupingBoard {...defaultProps} ideas={ideas} />)
      })

      it("ensures the cards are in their minimized variant to save grouping real estate", () => {
        const { className } = wrapper.find(GroupingIdeaCard).at(0).props()
        expect(className).to.match(/minimized/)
      })
    })

    context("when there are 35 ideas", () => {
      let wrapper
      const ideas = []

      beforeEach(() => {
        _.times(35, n => { ideas.push({ id: n, body: "fart" }) })

        wrapper = shallow(<GroupingBoard {...defaultProps} ideas={ideas} />)
      })

      it("does *not* minimize the cards within, as there is enough real estate to group comfortably", () => {
        const { className } = wrapper.find(GroupingIdeaCard).at(0).props()
        expect(className).to.not.match(/minimized/)
      })
    })
  })

  describe("dropTargetSpec", () => {
    let freshDropTargetSpec
    let reconcileMobileZoomOffsetsStub

    // bring in fresh copy of module to avoid memoization of values contaminating tests
    beforeEach(() => {
      freshDropTargetSpec = requireUncached("../../web/static/js/components/grouping_board").dropTargetSpec
    })

    describe("#hover", () => {
      let ideaDraggedInGroupingStage
      let props
      let monitor

      beforeEach(() => {
        ideaDraggedInGroupingStage = sinon.spy()

        props = {
          actions: {
            ideaDraggedInGroupingStage,
          },
        }

        reconcileMobileZoomOffsetsStub = sinon
          .stub(DragCoordinates, "reconcileMobileZoomOffsets").callsFake(() => ({ x: 39, y: 31 }))

        monitor = {
          getSourceClientOffset: sinon.stub(),
          getItem: () => ({
            draggedIdea: {
              id: 54,
            },
          }),
        }

        freshDropTargetSpec.hover(props, monitor)
      })

      afterEach(() => {
        reconcileMobileZoomOffsetsStub.restore()
      })

      it("invokes the ideaDraggedInGroupingStage action with attrs of the idea from the drag", () => {
        expect(ideaDraggedInGroupingStage).to.have.been.calledWithMatch({
          id: 54,
        })
      })

      it("also includes the reconciled x/y coordinates from the DragCoordinates service", () => {
        expect(ideaDraggedInGroupingStage).to.have.been.calledWithMatch({
          x: 39,
          y: 31,
        })
      })

      // the browser's hover event fires constantly, even when no movement,
      // so no need to slam the server for a non-change
      it("doesn't *re*-invoke ideaDraggedInGroupingStage when triggered with identical coordinates", () => {
        freshDropTargetSpec.hover(props, monitor)
        freshDropTargetSpec.hover(props, monitor)
        freshDropTargetSpec.hover(props, monitor)
        expect(ideaDraggedInGroupingStage).to.have.been.calledOnce
      })
    })
  })
})
