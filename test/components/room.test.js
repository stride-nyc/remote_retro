import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import Room from "../../web/static/js/components/room"

describe("Room", () => {
  let stubComponent

  const defaultProps = {
    alert: null,
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

  beforeEach(() => {
    stubComponent = ({ fart }) => <div data-testid="stub-component">{fart}</div>
  })

  test("renders an instance of that UI component", () => {
    render(
      <Room
        {...defaultProps}
        stageConfig={{
          uiComponent: stubComponent,
        }}
      />
    )

    expect(screen.getByTestId("stub-component")).toBeInTheDocument()
  })

  test("passes any and all props down to the specified UI component", () => {
    render(
      <Room
        {...defaultProps}
        stageConfig={{
          uiComponent: stubComponent,
        }}
        fart="store"
      />
    )

    expect(screen.getByText("store")).toBeInTheDocument()
  })
})
