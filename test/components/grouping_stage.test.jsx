import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import GroupingStage from "../../web/static/js/components/grouping_stage"

describe("GroupingStage component", () => {
  const defaultProps = {
    ideas: [],
    actions: {},
    currentUser: {},
    stage: "grouping",
    stageConfig: {},
    userOptions: {},
  }

  let originalScrollTo

  beforeEach(() => {
    originalScrollTo = window.scollTo
    window.scrollTo = spy()
  })

  afterEach(() => {
    window.scrollTo = originalScrollTo
  })

  context("when the component instantiates", () => {
    it("ensures that the user is scrolled to the top of the window so that every client's initial grouping card coordinates are consistent", () => {
      shallow(
        <GroupingStage {...defaultProps} />
      )

      expect(window.scrollTo).to.have.been.calledWith(0, 0)
    })

    context("when the component is updated", () => {
      it("does *not* scroll the window additional times, letting the user maintain their desired scroll level", () => {
        const wrapper = shallow(
          <GroupingStage {...defaultProps} />
        )

        wrapper.setProps({ ...defaultProps, currentUser: { name: "Some Guy" } })

        expect(window.scrollTo).to.have.been.calledOnce
      })
    })
  })
})
