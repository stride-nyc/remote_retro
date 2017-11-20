import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import LowerThird from "../../web/static/js/components/lower_third"
import IdeaGenerationLowerThirdContent from "../../web/static/js/components/idea_generation_lower_third_content" // eslint-disable-line line-length
import VotingLowerThirdContent from "../../web/static/js/components/voting_lower_third_content"
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
    it("passes `displayContents: false` to the lower third wrapper", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={CLOSED}
        />
      )

      expect(lowerThird.props().displayContents).to.eql(false)
    })
  })

  context("when the stage isn't `closed`", () => {
    it("passes `displayContents: true` to the lower third wrapper", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={IDEA_GENERATION}
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
          stage={VOTING}
        />
      )

      expect(lowerThird.find(VotingLowerThirdContent)).to.have.length(1)
      expect(lowerThird.find(IdeaGenerationLowerThirdContent)).to.have.length(0)
    })
  })
})
