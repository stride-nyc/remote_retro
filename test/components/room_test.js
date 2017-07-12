import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import Room from "../../web/static/js/components/room"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("Room component", () => {
  const mockRetroChannel = { push: spy(), on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: "idea-generation",
  }

  context("when the current user is facilitator", () => {
    const facilitatorUser = { is_facilitator: true }

    context("and showActionItems is false", () => {
      it("renders the <StageProgressionButton>", () => {
        const roomComponent = shallow(
          <Room {...defaultProps} currentUser={facilitatorUser} />
        )

        expect(roomComponent.find(StageProgressionButton)).to.have.length(1)
      })
    })

    context("and there are no action items during the action-items stage", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const roomComponent = shallow(
          <Room
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="action-items"
          />
        )
        const stageProgressionButton = roomComponent.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are action items during the action-items stage", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        const roomComponent = shallow(
          <Room
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="action-items"
            ideas={[{ category: "action-item" }]}
          />
        )
        const stageProgressionButton = roomComponent.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })
  })

  context("when the current user is not facilitator", () => {
    const nonFacilitatorUser = { is_facilitator: false }

    it("does not render <StageProgressionButton>", () => {
      const roomComponent = shallow(
        <Room {...defaultProps} currentUser={nonFacilitatorUser} />
      )

      expect(roomComponent.find(StageProgressionButton)).to.have.length(0)
    })
  })
})
