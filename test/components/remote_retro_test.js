import React from "react"
import { spy } from "sinon"
import { shallow } from "enzyme"

import ViewportMetaTag from "../../web/static/js/components/viewport_meta_tag"
import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, CLOSED } = STAGES

describe("RemoteRetro component", () => {
  const stubUser = {
    given_name: "Mugatu",
    is_facilitator: false,
  }
  const defaultProps = {
    currentUser: stubUser,
    isTabletOrAbove: true,
    isAnActionItemsStage: true,
    presences: [],
    groups: [],
    browser: { orientation: "landscape" },
    ideas: [],
    stage: IDEA_GENERATION,
    facilitatorName: "Daniel Handpan",
    ideaGenerationCategories: ["happy", "sad", "confused"],
    userOptions: {},
    stageConfig: {},
    retro: { stage: IDEA_GENERATION },
    actions: {
      currentUserHasBecomeFacilitator: () => {},
    },
  }

  context("when the component mounts", () => {
    it("triggers a hotjar event, passing the stage", () => {
      const hotjarSpy = spy(global, "hj")

      shallow(
        <RemoteRetro {...defaultProps} stage={CLOSED} />
      )

      expect(hotjarSpy).calledWith("trigger", CLOSED)
    })
  })

  // we can't afford to have this integration break, as the grouping stage relies
  // on viewport manipulation
  it("renders a ViewportMetaTag, passing stage, alert, and browser orientation", () => {
    const wrapper = shallow(
      <RemoteRetro
        {...defaultProps}
        alert={{ derp: "herp" }}
        browser={{ orientation: "portrait" }}
        stage="lobby"
      />
    )

    expect(wrapper.find(ViewportMetaTag).props()).to.eql({
      alert: { derp: "herp" },
      stage: "lobby",
      browserOrientation: "portrait",
    })
  })
})
