import React from "react"
import { spy } from "sinon"

import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, CLOSED } = STAGES

describe("RemoteRetro component", () => {
  const mockRetroChannel = {}
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    presences: [],
    ideas: [],
    stage: IDEA_GENERATION,
    facilitatorName: "Daniel Handpan",
    userToken: "",
  }

  context("when the component mounts", () => {
    it("triggers a hotjar event, passing the stage", () => {
      const hotjarSpy = spy(global, "hj")

      mountWithConnectedSubcomponents(
        <RemoteRetro {...defaultProps} stage={CLOSED} />
      )

      expect(hotjarSpy.calledWith("trigger", CLOSED)).to.eql(true)
      hotjarSpy.restore()
    })
  })
})
