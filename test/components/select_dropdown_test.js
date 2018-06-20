import React from "react"
import { shallow } from "enzyme"

import SelectDropdown from "../../web/static/js/components/select_dropdown"

describe("SelectDropdown component", () => {
  const defaultProps = {
    labelName: "label",
    value: "value",
    onChange() {},
    selectOptions: [],
    isRequired: false,
  }
  let wrapper

  context("when pointerText is not provided as a prop", () => {
    it("does not render the pointing label", () => {
      wrapper = shallow(<SelectDropdown {...defaultProps} />)
      expect(wrapper.find(".pointing")).to.have.length(0)
    })
  })
})
