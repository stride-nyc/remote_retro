import React from "react"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { spy } from "sinon"

import { RemoteRetro } from "../../web/static/js/components/remote_retro"

describe("RemoteRetro component", () => {
  const mockRetroChannel = {}
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: "idea-generation",
    userToken: "",
  }

  context("when the component mounts", () => {
    it("triggers a hotjar event, passing the stage", () => {
      const hotjarSpy = spy(global, "hj")

      mountWithConnectedSubcomponents(
        <RemoteRetro {...defaultProps} stage="closed" />
      )

      expect(hotjarSpy.calledWith("trigger", "closed")).to.eql(true)
      hotjarSpy.restore()
    })
  })
})
