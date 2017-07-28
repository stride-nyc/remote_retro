import React from "react"
import { shallow } from "enzyme"
import PrimeDirectiveStage from "../../web/static/js/components/prime_directive_stage"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("PrimeDirectiveStage", () => {
  let primeDirectiveStage

  describe("and the user is the facilitator", () => {
    primeDirectiveStage = shallow(
      <PrimeDirectiveStage
        isFacilitator
        progressionConfig={{}}
        users={[]}
        retroChannel={{}}
      />
    )

    it("renders the StageProgressionButton", () => {
      const stageProgressionButton = primeDirectiveStage.find(StageProgressionButton)

      expect(stageProgressionButton).to.have.length(1)
    })
  })

  describe("and the user is not the facilitator", () => {
    const primeDirectiveStageNotFacilitator = shallow(
      <PrimeDirectiveStage
        isFacilitator={false}
        progressionConfig={{}}
        users={[]}
        retroChannel={{}}
      />
    )

    it("doesn't render the StageProgressionButton", () => {
      const stageProgressionButton = primeDirectiveStageNotFacilitator.find(StageProgressionButton)

      expect(stageProgressionButton).to.have.length(0)
    })
  })
})
