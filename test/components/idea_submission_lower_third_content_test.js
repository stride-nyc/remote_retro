import React from "react"
import { shallow } from "enzyme"
import _ from "lodash"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"
import IdeaSubmissionLowerThirdContent from "../../web/static/js/components/idea_submission_lower_third_content"
import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"

describe("<IdeaSubmissionLowerThirdContent />", () => {
  const defaultProps = {
    currentUser: {},
    stageConfig: {},
    isAnActionItemsStage: false,
  }

  context("when in a non-action-items stage", () => {
    context("and there are no ideas", () => {
      const noIdeasProps = { ...defaultProps, isAnActionItemsStage: false, ideas: [] }

      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaSubmissionLowerThirdContent {...noIdeasProps} />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.true
      })
    })

    context("and there are ideas", () => {
      const propsWithIdeas = {
        ...defaultProps,
        isAnActionItemsStage: false,
        ideas: [{ category: "happy" }],
      }

      it("renders an enabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaSubmissionLowerThirdContent {...propsWithIdeas} />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })

      context("when there less than 75 ideas", () => {
        let lowerThird

        beforeEach(() => {
          const ideas = []

          _.times(74, n => {
            ideas.push({ id: n, body: "gripe!" })
          })

          const props = {
            ...defaultProps,
            isAnActionItemsStage: false,
            ideas,
          }

          lowerThird = shallow(
            <IdeaSubmissionLowerThirdContent {...props} />
          )
        })

        it("renders the IdeaSubmissionForm", () => {
          const ideaSubmissionForm = lowerThird.find(IdeaSubmissionForm)
          expect(ideaSubmissionForm.exists()).to.be.true
        })

        it("does not surface an idea limit reached notification", () => {
          const ideaGenerationLimitReached = lowerThird.findWhere(node => node.text().match(/idea limit reached/i))
          expect(ideaGenerationLimitReached.exists()).to.be.false
        })
      })
    })


    context("when there are 75 ideas", () => {
      let lowerThird

      beforeEach(() => {
        const ideas = []

        _.times(75, n => {
          ideas.push({ id: n, body: "gripe!" })
        })

        const props = {
          ...defaultProps,
          isAnActionItemsStage: false,
          ideas,
        }

        lowerThird = shallow(
          <IdeaSubmissionLowerThirdContent {...props} />
        )
      })

      it("does not *render* an IdeaSubmissionForm", () => {
        const ideaSubmissionForm = lowerThird.find(IdeaSubmissionForm)
        expect(ideaSubmissionForm.exists()).to.be.false
      })

      it("surfaces a notification that the idea limit has been reached", () => {
        const ideaGenerationLimitReached = lowerThird.findWhere(node => node.text().match(/idea limit reached/i))
        expect(ideaGenerationLimitReached.exists()).to.be.true
      })
    })
  })


  context("when in an `action-items` stage", () => {
    context("and there are no action items", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        const lowerThird = shallow(
          <IdeaSubmissionLowerThirdContent
            {...defaultProps}
            isAnActionItemsStage
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
          <IdeaSubmissionLowerThirdContent
            {...defaultProps}
            isAnActionItemsStage
            ideas={[{ category: "action-item" }]}
          />
        )
        const stageProgressionButton = lowerThird.find(StageProgressionButton)
        expect(stageProgressionButton.prop("buttonDisabled")).to.be.false
      })
    })
  })
})
