import React from "react"
import "@testing-library/jest-dom"

import ViewportMetaTag from "../../web/static/js/components/viewport_meta_tag"
import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import STAGES from "../../web/static/js/configs/stages"
import renderWithRedux from "../support/js/render_with_redux"

const { IDEA_GENERATION } = STAGES

jest.mock("../../web/static/js/components/viewport_meta_tag", () => {
  return jest.fn(() => <div data-testid="viewport-meta-tag" />)
})

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
    stageConfig: {
      uiComponent: () => <div>Mock UI Component</div>,
    },
    retro: { stage: IDEA_GENERATION },
    actions: {
      currentUserHasBecomeFacilitator: () => {},
    },
  }

  // we can't afford to have this integration break, as the grouping stage relies
  // on viewport manipulation
  it("renders a ViewportMetaTag, passing stage, alert, and browser orientation", () => {
    renderWithRedux(
      <RemoteRetro
        {...defaultProps}
        alert={{
          derp: "herp",
          headerText: "Test Alert",
          BodyComponent: () => <div>Test Alert Body</div>,
        }}
        browser={{ orientation: "portrait" }}
        stage="lobby"
      />
    )

    expect(ViewportMetaTag).toHaveBeenCalledWith(
      {
        alert: {
          derp: "herp",
          headerText: "Test Alert",
          BodyComponent: expect.any(Function),
        },
        stage: "lobby",
        browserOrientation: "portrait",
      },
      expect.anything()
    )
  })

  describe("when the component has rendered", () => {
    describe("when the datadog rum client is available on the window", () => {
      it("notifies datadog that the single page app has mounted", () => {
        global.DD_RUM = {
          onReady: jest.fn(cb => cb()),
          addTiming: jest.fn(),
        }
        window.DD_RUM = global.DD_RUM

        renderWithRedux(
          <RemoteRetro {...defaultProps} />
        )

        expect(DD_RUM.addTiming).toHaveBeenCalledWith("SPA_MOUNTED")
      })
    })

    describe("when datadog rum is *not* on the window, due to ad blocking or a race", () => {
      it("does not blow up", () => {
        delete global.DD_RUM
        delete window.DD_RUM

        expect(() => {
          renderWithRedux(
            <RemoteRetro {...defaultProps} />
          )
        }).not.toThrow()
      })
    })
  })
})
