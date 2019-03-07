import React from "react"
import { shallow } from "enzyme"

import IdeaContentBase from "../../web/static/js/components/idea_content_base"
import StageAwareIdeaControls from "../../web/static/js/components/stage_aware_idea_controls"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("<IdeaContentBase />", () => {
  let wrapper

  const defaultProps = {
    idea: { body: "body text" },
    currentUser: {},
    retroChannel: {},
    stage: IDEA_GENERATION,
    canUserEditIdeaContents: true,
    draggable: false,
  }

  it("renders the control icons before idea body text to ensure floating/text-wrapping", () => {
    const wrapper = shallow(
      <IdeaContentBase {...defaultProps} />
    )

    const stageAwareIdeaControls = wrapper.childAt(0).is(StageAwareIdeaControls)
    expect(stageAwareIdeaControls).to.be.true
  })

  context("when the idea's updated_at value is greater than its inserted_at value", () => {
    beforeEach(() => {
      const editedIdea = {
        inserted_at: "2017-04-14T17:30:10",
        updated_at: "2017-04-14T17:30:12",
      }

      wrapper = shallow(
        <IdeaContentBase
          {...defaultProps}
          idea={editedIdea}
        />
      )
    })

    it("informs the user that the idea has been edited", () => {
      expect(wrapper.text()).to.match(/\(edited\)/i)
    })
  })

  context("when the idea's updated_at value is equal to its inserted_at value", () => {
    beforeEach(() => {
      const nonEditedIdea = {
        inserted_at: "2017-04-14T17:30:10",
        updated_at: "2017-04-14T17:30:10",
      }

      wrapper = shallow(
        <IdeaContentBase
          {...defaultProps}
          idea={nonEditedIdea}
        />
      )
    })

    it("mentions nothing about the idea being edited", () => {
      expect(wrapper.text()).not.to.match(/\(edited\)/i)
    })
  })

  context("when the idea has an assignee", () => {
    const assignee = {
      name: "Betty White",
    }

    const idea = {
      body: "Do the thing",
    }

    const wrapper = shallow(
      <IdeaContentBase
        {...defaultProps}
        assignee={assignee}
        idea={idea}
      />
    )

    it("contains the assignees's name next to the idea", () => {
      expect(wrapper.text()).to.match(/Do the thing \(Betty White\)/)
    })
  })

  context("when the idea *lacks* an assignee", () => {
    const idea = {
      body: "Sleep better",
    }

    const wrapper = shallow(
      <IdeaContentBase
        {...defaultProps}
        assignee={null}
        idea={idea}
      />
    )

    it("does not add a parenthetical after the idea body", () => {
      expect(wrapper.text()).to.match(/Sleep better$/)
    })
  })
})
