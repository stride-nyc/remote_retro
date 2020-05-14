import React from "react"
import { shallow } from "enzyme"
import EmailOptInToggle from "../../web/static/js/components/email_opt_in_toggle"

describe("EmailOptInToggle", () => {
  const defaultProps = {
    actions: {},
    emailOptIn: false,
  }

  const wrapper = (props = defaultProps) => {
    return shallow(
      <EmailOptInToggle {...props} />
    )
  }

  const checkboxState = (props = defaultProps) => {
    return wrapper(props).find("input[type='checkbox']").prop("checked")
  }

  context("when the user previously opted out", () => {
    it("renders its checkbox input in the unchecked state", () => {
      expect(checkboxState()).to.eql(false)
    })
  })

  context("when the user previously opted in", () => {
    it("renders its checkbox input in the checked state", () => {
      expect(checkboxState({ ...defaultProps, ...{ emailOptIn: true } })).to.eql(true)
    })
  })

  context("when the user clicks the toggle", () => {
    xit("renders its checkbox input in the opposite state", () => {
      const oldState = checkboxState()
      expect(checkboxState()).to.eql(!oldState)
    })

    xit("sends the updated preference to the server for persistence", () => {

    })
  })
})
