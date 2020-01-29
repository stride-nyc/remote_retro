import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import GroupLabelInput from "../../web/static/js/components/group_label_input"

describe("GroupLabelInput component", () => {
  describe("upon blurring the input field", () => {
    let submitGroupLabelChangesSpy
    let groupWithAssociatedIdeasAndVotes

    beforeEach(() => {
      groupWithAssociatedIdeasAndVotes = {
        id: 777,
        label: "some previous label",
        ideas: [],
        votes: [],
      }

      submitGroupLabelChangesSpy = sinon.spy()
      const wrapper = shallow(
        <GroupLabelInput
          groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
          actions={{ submitGroupLabelChanges: submitGroupLabelChangesSpy }}
        />
      )

      const input = wrapper.find("input")
      input.simulate("blur", { target: { value: "Turtles" } })
    })

    it("invokes submitGroupLabelChanges with the group attributes", () => {
      expect(
        submitGroupLabelChangesSpy
      ).to.have.been.calledWith(groupWithAssociatedIdeasAndVotes, "Turtles")
    })
  })
})
