import React from "react"
import { spy } from "sinon"

import ConditionallyDraggableIdeaContent from "../../web/static/js/components/conditionally_draggable_idea_content"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("<ConditionallyDraggableIdeaContent />", () => {
  let wrapper

  const defaultProps = {
    idea: { body: "body text" },
    currentUser: {},
    retroChannel: {},
    stage: IDEA_GENERATION,
  }

  it("renders the control icons before idea body text to ensure floating/text-wrapping", () => {
    const wrapper = mountWithConnectedSubcomponents(
      <ConditionallyDraggableIdeaContent {...defaultProps} />
    )

    expect(wrapper.html()).to.match(/<i.*><\/i>.*body text/)
  })

  context("when the idea's updated_at value is more than one second greater than its inserted_at value", () => {
    beforeEach(() => {
      const editedIdea = {
        inserted_at: "2017-04-14T17:30:10",
        updated_at: "2017-04-14T17:30:12",
      }

      wrapper = mountWithConnectedSubcomponents(
        <ConditionallyDraggableIdeaContent
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

      wrapper = mountWithConnectedSubcomponents(
        <ConditionallyDraggableIdeaContent
          {...defaultProps}
          idea={nonEditedIdea}
        />
      )
    })

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

    const wrapper = mountWithConnectedSubcomponents(
      <ConditionallyDraggableIdeaContent
        {...defaultProps}
        assignee={assignee}
        idea={idea}
      />
    )

    it("contains the user's given_name next to the idea", () => {
      expect(wrapper.text()).to.match(/Do the thing \(Betty White\)/)
    })
  })

  context("when the device is tablet or larger", () => {
    const defaultGlobalWidth = window.innerWidth

    before(() => {
      window.innerWidth = 1440
    })

    after(() => {
      window.innerWidth = defaultGlobalWidth
    })

    context("and the user is a faciliator and the stage is idea-generation", () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
          currentUser: { is_facilitator: true },
          stage: "idea-generation",
        }

        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=true", () => {
        expect(wrapper.html()).to.match(/draggable="true"/)
      })
    })

    context("when the user is a faciliator and the stage is *not* idea-generation", () => {
      const props = {
        ...defaultProps,
        currentUser: { is_facilitator: true },
        stage: "voting",
      }

      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=false", () => {
        expect(wrapper.html()).to.match(/draggable="false"/)
      })
    })

    context("when the user created the idea and the stage is idea-generation", () => {
      const props = {
        ...defaultProps,
        currentUser: { id: 101 },
        idea: { user_id: 101 },
        stage: "idea-generation",
      }

      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=true", () => {
        expect(wrapper.html()).to.match(/draggable="true"/)
      })
    })

    context("when the user created the idea and the stage is not idea-generation", () => {
      const props = {
        ...defaultProps,
        currentUser: { id: 101 },
        idea: { user_id: 101 },
        stage: "voting",
      }

      before(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=false", () => {
        expect(wrapper.html()).to.match(/draggable="false"/)
      })
    })

    context("when the user did not create the idea", () => {
      const props = {
        ...defaultProps,
        currentUser: { id: 600 },
        idea: { user_id: 101 },
      }

      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=false", () => {
        expect(wrapper.html()).to.match(/draggable="false"/)
      })
    })

    context("when the idea is being dragged", () => {
      const idea = { id: 1, body: "yo sup" }
      const props = {
        ...defaultProps,
        currentUser: { is_facilitator: true },
        stage: "idea-generation",
        idea,
      }

      const mockDragEvent = {
        preventDefault: () => {},
        dataTransfer: { setData: spy(), dropEffect: null },
      }

      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )

        wrapper.simulate("dragStart", mockDragEvent)
      })

      it("sets the drop effect on the event to 'move'", () => {
        expect(mockDragEvent.dataTransfer.dropEffect).to.eql("move")
      })

      it("sets the idea id on the event data element", () => {
        const stringifiedIdea = JSON.stringify(idea)
        expect(
          mockDragEvent.dataTransfer.setData
        ).calledWith("idea", stringifiedIdea)
      })
    })
  })

  context("when the device has a screen width less than the common tablet", () => {
    const defaultGlobalWidth = window.innerWidth

    before(() => {
      window.innerWidth = 600
    })

    after(() => {
      window.innerWidth = defaultGlobalWidth
    })

    context("and the user is a faciliator and the stage is idea-generation", () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
          currentUser: { is_facilitator: true },
          stage: "idea-generation",
        }

        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=false", () => {
        expect(wrapper.html()).to.match(/draggable="false"/)
      })
    })

    context("when the user created the idea and the stage is idea-generation", () => {
      const props = {
        ...defaultProps,
        currentUser: { id: 101 },
        idea: { user_id: 101 },
        stage: "idea-generation",
      }

      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ConditionallyDraggableIdeaContent {...props} />
        )
      })

      it("sets draggable=true", () => {
        expect(wrapper.html()).to.match(/draggable="false"/)
      })
    })
  })
})
