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

  context("when the isRequired prop is false", () => {
    it("does not render with a 'required' class for the 'Category' label", () => {
      wrapper = shallow(<SelectDropdown {...defaultProps} />)
      expect(wrapper.find(".required")).to.have.length(0)
    })
  })

  context("when the isRequired prop is true", () => {
    it("renders with a 'required' class for the 'Assignee' label", () => {
      const props = Object.assign(defaultProps, { isRequired: true })
      wrapper = shallow(<SelectDropdown {...props} />)
      expect(wrapper.find(".required")).to.have.length(1)
    })
  })

  context("when pointerText is not provided as a prop", () => {
    it("does not render the pointing label", () => {
      wrapper = shallow(<SelectDropdown {...defaultProps} />)
      expect(wrapper.find(".pointing")).to.have.length(0)
    })
  })
})
