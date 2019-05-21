import React from "react"

import LobbyStage from "../../web/static/js/components/lobby_stage"

describe("LobbyStage component", () => {
  let wrapper
  let props
  const currentUser = {
    given_name: "Carol",
    is_facilitator: true,
    id: 1,
    picture: "http://derp.com",
    token: "herp",
  }
  const defaultProps = {
    stageConfig: {},
    currentUser,
    presences: [currentUser],
    retroChannel: {},
    facilitatorName: "Darren",
  }

  context("when the currentUser is the facilitator", () => {
    beforeEach(() => {
      props = { ...defaultProps }
    })

    it("contains the instructions specific to the facilitator", () => {
      wrapper = mountWithConnectedSubcomponents(<LobbyStage {...props} />)

      expect(wrapper.text()).to.include("responsibility")
    })
  })

  context("when the currentUser is not the facilitator", () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        currentUser: { ...currentUser, is_facilitator: false },
      }
    })

    it("contains the instructions specific to participants", () => {
      wrapper = mountWithConnectedSubcomponents(<LobbyStage {...props} />)

      expect(wrapper.text()).to.include("hold tight")
    })
  })
})
