import React from "react"
import { shallow } from "enzyme"

import LobbyStage, { instructionText } from "../../web/static/js/components/lobby_stage"

describe("LobbyStage component", () => {
  let wrapper
  let props
  const currentUser = {
    given_name: "Carol",
  }
  const defaultProps = {
    progressionConfig: {},
    currentUser,
    isFacilitator: false,
    users: [],
  }

  context("when the currentUser is the facilitator", () => {
    props = { ...defaultProps, isFacilitator: true }

    it("contains the instructions specific to the facilitator", () => {
      wrapper = shallow(<LobbyStage {...props} />)
      const expectedText = instructionText(true, "Carol")

      expect(wrapper.text()).to.include(expectedText)
    })
  })

  context("when the currentUser is not the facilitator", () => {
    props = { ...defaultProps }

    it("contains the instructions specific to participants", () => {
      wrapper = shallow(<LobbyStage {...props} />)
      const expectedText = instructionText(false, "Carol")

      expect(wrapper.text()).to.include(expectedText)
    })
  })
})
