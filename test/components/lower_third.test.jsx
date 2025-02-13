import React from "react"
import { shallow } from "enzyme"

import LowerThird from "../../web/static/js/components/lower_third"
import IdeaSubmissionLowerThirdContent from "../../web/static/js/components/idea_submission_lower_third_content" // eslint-disable-line line-length
import GroupingLowerThirdContent from "../../web/static/js/components/grouping_lower_third_content" // eslint-disable-line line-length
import VotingLowerThirdContent from "../../web/static/js/components/voting_lower_third_content"
import ClosedLowerThirdContent from "../../web/static/js/components/closed_lower_third_content"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, CLOSED, GROUPING } = STAGES

describe("LowerThird component", () => {
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    actions: {},
    userOptions: {},
    currentUser: stubUser,
    users: [],
    ideas: [],
    stage: IDEA_GENERATION,
    isAnActionItemsStage: false,
    stageConfig: {},
  }

  context("when the stage is `idea generation`", () => {
    it("renders the idea generation lower third", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={IDEA_GENERATION}
        />
      )

      expect(lowerThird.find(IdeaSubmissionLowerThirdContent)).to.have.length(1)
    })
  })

  context("when the stage is `closed`", () => {
    it("renders business about the retro being read-only", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={CLOSED}
        />
      )

      expect(lowerThird.find(ClosedLowerThirdContent)).to.have.length(1)
    })
  })

  context("when the stage is `grouping`", () => {
    it("renders grouping display", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={GROUPING}
        />
      )

      expect(lowerThird.find(GroupingLowerThirdContent)).to.have.length(1)
    })
  })

  context("when the stage is voting", () => {
    it("renders voting lower third content", () => {
      const lowerThird = shallow(
        <LowerThird
          {...defaultProps}
          stage={VOTING}
        />
      )

      expect(lowerThird.find(VotingLowerThirdContent)).to.have.length(1)
    })
  })
})
