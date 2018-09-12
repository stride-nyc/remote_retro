import React from "react"
import { shallow, render } from "enzyme"
import { spy } from "sinon"

import LowerThird from "../../web/static/js/components/lower_third"
import IdeaGenerationLowerThirdContent from "../../web/static/js/components/idea_generation_lower_third_content" // eslint-disable-line line-length
import VotingLowerThirdContent from "../../web/static/js/components/voting_lower_third_content"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, CLOSED } = STAGES

describe("LowerThird component", () => {
  const mockRetroChannel = { push: spy(), on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: IDEA_GENERATION,
  }

  context("when the stage is `closed`", () => {
    it("renders business about the retro being read-only", () => {
      const lowerThird = render(
        <LowerThird
          {...defaultProps}
          stage={CLOSED}
        />
      )

      expect(lowerThird.text()).to.match(/read-only/i)
    })
  })

  context("when the stage is voting", () => {
    it("renders <VotesLeft /> in place of <IdeaSubmissionForm />", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={VOTING}
        />
      )

      expect(lowerThird.find(VotingLowerThirdContent)).to.have.length(1)
      expect(lowerThird.find(IdeaGenerationLowerThirdContent)).to.have.length(0)
    })

    context("when the user is the facilitator", () => {
      it("renders the 'Proceed to Action Items button", () => {
        const currentUser = { is_facilitator: true }
        const lowerThird = mountWithConnectedSubcomponents(
          <LowerThird
            {...defaultProps}
            currentUser={currentUser}
            stage={VOTING}
          />
        )
        expect(lowerThird.find(StageProgressionButton)).to.have.length(1)
      })
    })

    context("when the user is not the facilitator", () => {
      it("does not render the 'Proceed to Action Items button", () => {
        const currentUser = { is_facilitator: false }
        const lowerThird = mountWithConnectedSubcomponents(
          <LowerThird
            {...defaultProps}
            currentUser={currentUser}
            stage={VOTING}
          />
        )
        expect(lowerThird.find(StageProgressionButton)).to.have.length(0)
      })
    })
  })
})
