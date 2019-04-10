import React from "react"
import { spy } from "sinon"
import { shallow } from "enzyme"


import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, CLOSED } = STAGES

describe("RemoteRetro component", () => {
  const mockRetroChannel = {}
  const stubUser = {
    given_name: "Mugatu",
    is_facilitator: false,
  }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    isTabletOrAbove: true,
    presences: [],
    ideas: [],
    stage: IDEA_GENERATION,
    facilitatorName: "Daniel Handpan",
    retro: { stage: IDEA_GENERATION },
    actions: {
      newFacilitator: spy(),
    },
  }

  context("when the component mounts", () => {
    it("triggers a hotjar event, passing the stage", () => {
      const hotjarSpy = spy(global, "hj")

      mountWithConnectedSubcomponents(
        <RemoteRetro {...defaultProps} stage={CLOSED} />
      )

      expect(hotjarSpy).calledWith("trigger", CLOSED)
    })
  })

  describe("when component updates with a new facilitator", () => {
    let newFacilitator
    beforeEach(() => {
      newFacilitator = {
        ...stubUser,
        is_facilitator: true,
      }
    })

    it("calls the new facilitator action", () => {
      const wrapper = shallow(<RemoteRetro {...defaultProps} />)
      wrapper.setProps({ user: newFacilitator })
      expect(defaultProps.actions.newFacilitator.calledWith(defaultProps.retro))
    })
  })

  describe("when component updates without a new facilitator", () => {
    it("does not call the new facilitator action", () => {
      const wrapper = shallow(<RemoteRetro {...defaultProps} />)
      wrapper.setProps({ stage: CLOSED, user: stubUser })
      expect(defaultProps.actions.newFacilitator.notCalled).to.eql(true)
    })
  })
})
