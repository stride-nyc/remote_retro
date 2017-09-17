import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import LowerThird from "../../web/static/js/components/lower_third"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"
import IdeaGenerationLowerThirdContent from "../../web/static/js/components/idea_generation_lower_third_content" // eslint-disable-line line-length
import VotingLowerThirdContent from "../../web/static/js/components/voting_lower_third_content"

describe("LowerThird component", () => {
  const mockRetroChannel = { push: spy(), on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const votingStage = "voting"
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: "idea-generation",
  }

  context("when the current user is facilitator", () => {
    const facilitatorUser = { is_facilitator: true }

    context("and there are no ideas during the idea-generation stage", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="idea-generation"
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are ideas during the idea-generation stage", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="idea-generation"
            ideas={[{ category: "happy" }]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })

    context("and there are no action items during the action-items stage", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="action-items"
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are action items during the action-items stage", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <LowerThird
            {...defaultProps}
            currentUser={facilitatorUser}
            stage="action-items"
            ideas={[{ category: "action-item" }]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })
  })

  context("when the state is closed", () => {
    it("passes `displayContents: false` to the lower third wrapper", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage="closed"
        />
      )

      expect(lowerThird.props().displayContents).to.eql(false)
    })
  })

  context("when the state isn't closed", () => {
    it("passes `displayContents: true` to the lower third wrapper", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage="idea-generation"
        />
      )

      expect(lowerThird.props().displayContents).to.eql(true)
    })
  })

  context("when the stage is voting", () => {
    it("renders <VotesLeft /> in place of <IdeaSubmissionForm />", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={votingStage}
        />
      )

      expect(lowerThird.find(VotingLowerThirdContent)).to.have.length(1)
      expect(lowerThird.find(IdeaGenerationLowerThirdContent)).to.have.length(0)
    })
  })
})
