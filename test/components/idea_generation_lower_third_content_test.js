import React from "react"
import { shallow } from "enzyme"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"
import IdeaGenerationLowerThirdContent from "../../web/static/js/components/idea_generation_lower_third_content" // eslint-disable-line line-length
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, ACTION_ITEMS } = STAGES

describe("<IdeaGenerationLowerThirdContent />", () => {
  const defaultProps = {
    retroChannel: {},
    currentUser: {},
  }

  context("when it's the `idea-generation` stage", () => {
    context("and there are no ideas", () => {
      const noIdeasProps = { ...defaultProps, stage: IDEA_GENERATION, ideas: [] }

      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaGenerationLowerThirdContent {...noIdeasProps} />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are ideas", () => {
      const propsWithIdeas = {
        ...defaultProps,
        stage: IDEA_GENERATION,
        ideas: [{ category: "happy" }],
      }

      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaGenerationLowerThirdContent {...propsWithIdeas} />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })
  })


  context("when it's the `action-items` stage", () => {
    context("and there are no action items", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaGenerationLowerThirdContent
            {...defaultProps}
            stage={ACTION_ITEMS}
            ideas={[]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are action items", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaGenerationLowerThirdContent
            {...defaultProps}
            stage={ACTION_ITEMS}
            ideas={[{ category: "action-item" }]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })
  })
})
