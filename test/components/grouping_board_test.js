import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"

import { dropTargetSpec, GroupingBoard } from "../../web/static/js/components/grouping_board"
import GroupingStageIdeaCard from "../../web/static/js/components/grouping_stage_idea_card"
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
  }

  context("when there are no ideas to render", () => {
    it("renders no idea cards", () => {
      const wrapper = shallow(
        <GroupingBoard {...defaultProps} ideas={[]} />
      )

      expect(wrapper.find(GroupingStageIdeaCard)).to.have.length(0)
    })
  })

  context("when there are ideas to render", () => {
    it("renders an idea for each card", () => {
      const wrapper = shallow(
        <GroupingBoard {...defaultProps} ideas={[{ body: "hey", id: 5 }, { body: "hey", id: 6 }]} />
      )

      expect(wrapper.find(GroupingStageIdeaCard)).to.have.length(2)
    })
  })

  describe("dropTargetSpec", () => {
    let freshDropTargetSpec
    let reconcileMobileZoomOffsetsStub

    // bring in fresh copy of module to avoid memoization of values contaminating tests
    beforeEach(() => {
      freshDropTargetSpec = requireUncached("../../web/static/js/components/grouping_board").dropTargetSpec
    })

    describe("#drop", () => {
      let submitIdeaEditAsync

      beforeEach(() => {
        submitIdeaEditAsync = sinon.spy()

        const props = {
          actions: {
            submitIdeaEditAsync,
          },
        }

        reconcileMobileZoomOffsetsStub = sinon
          .stub(DragCoordinates, "reconcileMobileZoomOffsets", () => ({ x: 11, y: 22 }))

        const monitor = {
          getSourceClientOffset: sinon.stub(),
          getItem: () => ({
            draggedIdea: {
              id: 54,
            },
          }),
        }

        dropTargetSpec.drop(props, monitor)
      })

      afterEach(() => {
        reconcileMobileZoomOffsetsStub.restore()
      })

      it("invokes the submitIdeaEditAsync action with attrs of the idea from the drag", () => {
        expect(submitIdeaEditAsync).to.have.been.calledWithMatch({
          id: 54,
        })
      })

      it("also includes the reconciled x/y coordinates from the DragCoordinates service", () => {
        expect(submitIdeaEditAsync).to.have.been.calledWithMatch({
          x: 11,
          y: 22,
        })
      })
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
          .stub(DragCoordinates, "reconcileMobileZoomOffsets", () => ({ x: 39, y: 31 }))

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
