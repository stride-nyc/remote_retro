import React from "react"
import { mount } from "enzyme"
import sinon from "sinon"

import SuccessCheckmark from "../../web/static/js/components/success_checkmark"

describe("SuccessCheckmark component", () => {
  let onMountSpy

  beforeEach(() => {
    onMountSpy = sinon.spy()

    mount(
      <SuccessCheckmark
        onMount={onMountSpy}
      />
    )
  })

  it("invokes the on mount callback passed by the consumer on mount", () => {
    expect(onMountSpy).to.have.been.called
  })
})
