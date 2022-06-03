import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import ViewportMetaTag from "../../web/static/js/components/viewport_meta_tag"
import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("RemoteRetro component", () => {
  const stubUser = {
    given_name: "Mugatu",
    is_facilitator: false,
  }
  const defaultProps = {
    currentUser: stubUser,
    isTabletOrAbove: true,
    usersById: {},
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

  context("when the component has rendered", () => {
    describe("when the datadog rum client is available on the window", () => {
      it("notifies datadog that the single page app has mounted", () => {
        global.DD_RUM = window.DD_RUM = {
          onReady: (cb) => cb(),
          addTiming: spy(),
        }

        shallow(
          <RemoteRetro {...defaultProps} />
        )

        expect(DD_RUM.addTiming).calledWith("SPA_MOUNTED")
      })
    })

    describe("when datadog rum is *not* on the window, due to ad blocking or a race", () => {
      it("does not blow up", () => {
        delete global.DD_RUM
        delete window.DD_RUM

        expect(() => {
          shallow(
            <RemoteRetro {...defaultProps} />
          )
        }).not.to.throw();
      })
    })
  })
})
