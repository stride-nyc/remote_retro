import React from "react"
import { shallow } from "enzyme"

import SelectDropdown from "../../web/static/js/components/select_dropdown"

describe("SelectDropdown component", () => {
  const defaultProps = {
    labelName: "label",
    value: "value",
    onChange() {},
    selectOptions: [],
  }
  let wrapper

  context("when pointerText is provided as a prop", () => {
    const props = { ...defaultProps, pointerText: "Type yo thang!" }
    wrapper = shallow(<SelectDropdown {...props} />)

    it("renders the pointing label", () => {
      console.log(props)
      console.log(wrapper.debug())
      expect(wrapper.find(".pointing")).to.have.length(1)
    })
  })

  context("when pointerText is not provided as a prop", () => {
    wrapper = shallow(<SelectDropdown {...defaultProps} />)

    it("does not render the pointing label", () => {
      expect(wrapper.find(".pointing")).to.have.length(0)
    })
  })
})
