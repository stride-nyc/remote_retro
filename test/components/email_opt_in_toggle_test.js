import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"
import EmailOptInToggle from "../../web/static/js/components/email_opt_in_toggle"

describe("EmailOptInToggle", () => {
  const defaultProps = {
    actions: {},
    currentUser: { id: 777, email_opt_in: false },
  }

  const wrapper = (props = defaultProps) => {
    return shallow(
      <EmailOptInToggle {...props} />
    )
  }

  const checkboxState = (props = defaultProps) => {
    return wrapper(props).find("input[type='checkbox']").prop("checked")
  }

  context("when the current user previously opted out", () => {
    it("renders its checkbox input in the unchecked state", () => {
      expect(checkboxState()).to.eql(false)
    })
  })

  context("when the user previously opted in", () => {
    it("renders its checkbox input in the checked state", () => {
      expect(checkboxState({ ...defaultProps, currentUser: { email_opt_in: true } })).to.eql(true)
    })
  })

  context("when the user clicks the toggle", () => {
    let emailOptInToggleWrapper
    let updateUserSpy

    beforeEach(() => {
      updateUserSpy = sinon.spy()
      emailOptInToggleWrapper = shallow(
        <EmailOptInToggle
          {...defaultProps}
          actions={{ updateUser: updateUserSpy }}
        />
      )

      emailOptInToggleWrapper.find("button").simulate("click")
    })

    it("sends the updated preference to the server for persistence", () => {
      expect(updateUserSpy).to.have.been.calledWith(777, { email_opt_in: true })
    })
  })
})
