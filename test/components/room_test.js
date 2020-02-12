import React from "react"
import { shallow } from "enzyme"

import Room from "../../web/static/js/components/room"

describe("Room", () => {
  let room
  const defaultProps = {
    presences: [{
      given_name: "treezy",
      online_at: 803,
      picture: "http://herpderp.com",
    }],
    ideas: [],
    groups: [],
    facilitatorName: "Dirk",
    stageConfig: {},
    currentUser: { is_facilitator: false, token: "33ndk" },
    actions: {},
    browser: {},
    userOptions: {},
  }

  describe("when the stage config contains a UI component", () => {
    const stubComponent = () => <div>Stub Component</div>

    it("renders an instance of that UI component", () => {
      room = shallow(
        <Room
          {...defaultProps}
          stageConfig={{
            uiComponent: stubComponent,
          }}
        />
      )

      const uiComponent = room.find(stubComponent)

      expect(uiComponent).to.have.length(1)
    })

    it("passes any and all props down to the specified UI component", () => {
      room = shallow(
        <Room
          {...defaultProps}
          stageConfig={{
            uiComponent: stubComponent,
          }}
          fart="store"
        />
      )

      const uiComponent = room.find(stubComponent)

      expect(uiComponent.prop("fart")).to.eql("store")
    })
  })
})
