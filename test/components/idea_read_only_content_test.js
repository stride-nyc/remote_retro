import React from "react"
import { shallow } from "enzyme"

import IdeaReadOnlyContent from "../../web/static/js/components/idea_read_only_content"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("<IdeaReadOnlyContent />", () => {
  const defaultProps = {
    idea: {},
    currentUser: {},
    retroChannel: {},
    stage: IDEA_GENERATION,
  }

  it("renders IdeaControls as its first child for proper floating/text-wrapping", () => {
    const wrapper = shallow(
      <IdeaReadOnlyContent {...defaultProps} />
    )

    expect(wrapper.childAt(0).name()).to.match(/IdeaControls/)
  })

  context("when the idea's updated_at value is more than one second greater than its inserted_at value", () => {
    const editedIdea = {
      inserted_at: "2017-04-14T17:30:10",
      updated_at: "2017-04-14T17:30:12",
    }

    const wrapper = shallow(
      <IdeaReadOnlyContent
        {...defaultProps}
        idea={editedIdea}
      />
    )

    it("informs the user that the idea has been edited", () => {
      expect(wrapper.text()).to.match(/\(edited\)/i)
    })
  })

  context("when the idea's updated_at value is equal to its inserted_at value", () => {
    const nonEditedIdea = {
      inserted_at: "2017-04-14T17:30:10",
      updated_at: "2017-04-14T17:30:10",
    }

    const wrapper = shallow(
      <IdeaReadOnlyContent
        {...defaultProps}
        idea={nonEditedIdea}
      />
    )

    it("mentions nothing about the idea being edited", () => {
      expect(wrapper.text()).not.to.match(/\(edited\)/i)
    })
  })

  context("when idea is an action_item and has been assigned to a user", () => {
    const assignee = {
      name: "Betty White",
    }

    const idea = {
      body: "Do the thing",
    }

    const wrapper = shallow(
      <IdeaReadOnlyContent
        {...defaultProps}
        assignee={assignee}
        idea={idea}
      />
    )

    it("contains the user's given_name next to the idea", () => {
      expect(wrapper.text()).to.match(/Do the thing \(Betty White\)/)
    })
  })
})
