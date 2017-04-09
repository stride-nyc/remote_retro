import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaControls from "../../web/static/js/components/idea_controls"

describe("<IdeaControls />", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }

  describe("on click of the removal icon", () => {
    it("invokes the callback passed as handleDelete", () => {
      const handleDeleteSpy = sinon.spy()

      const wrapper = shallow(
        <IdeaControls idea={idea} handleDelete={handleDeleteSpy} />)

      wrapper.find(".remove.icon").simulate("click")
      expect(handleDeleteSpy.called).to.equal(true)
    })
  })
})
