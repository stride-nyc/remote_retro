import React from "react"
import { shallow, mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaEditForm from "../../web/static/js/components/idea_edit_form"

describe("<IdeaEditForm />", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }

  describe("on initial render", () => {
    it("is pre-populated with the given idea's body text", () => {
      const wrapper = shallow(<IdeaEditForm idea={idea} />)

      const textAreaValue = wrapper.find("textarea").props().value
      expect(textAreaValue).to.equal("redundant tests")
    })
  })

  describe("on change of the textarea", () => {
    it("the value prop of the textarea updates in turn", () => {
      const wrapper = mount(<IdeaEditForm idea={idea} />)
      const textarea = wrapper.find("textarea")

      textarea.simulate("change", { target: { value: "some value" }})

      expect(textarea.props().value).to.equal("some value")
    })
  })
})
