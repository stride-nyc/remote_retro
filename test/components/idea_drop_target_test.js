import React from "react"
import { shallow } from "enzyme"
import { spy, stub } from "sinon"

import { buildIdeaDragEvent } from "../support/js/test_helper"
import { IdeaDropTarget } from "../../web/static/js/components/idea_drop_target"

describe("IdeaDropTarget", () => {
  let wrapper

  const defaultProps = {
    onDropOfIdea: () => {},
  }

  context("when an item is dragged over it", () => {
    let mockEvent

    before(() => {
      mockEvent = { preventDefault: spy(), dataTransfer: { dropEffect: null } }

      wrapper = shallow(
        <IdeaDropTarget
          {...defaultProps}
        />
      )

      wrapper.simulate("dragOver", mockEvent)
    })

    it("prevents the default event behavior", () => {
      expect(mockEvent.preventDefault).called
    })

    it("adds a 'dragged-over' class", () => {
      expect(wrapper.find(".dragged-over").length).to.equal(1)
    })

    context("when a dragLeave event follows", () => {
      const relatedTarget = {}

      context("and the event's target element *does* contain the related (dragged) elemant", () => {
        beforeEach(() => {
          mockEvent = {
            relatedTarget,
            currentTarget: {
              contains: stub().withArgs(relatedTarget).returns(true),
            },
          }

          wrapper.simulate("dragLeave", mockEvent)
        })

        it("doesn't remove the dragged-over class", () => {
          expect(wrapper.find(".dragged-over").length).to.equal(1)
        })
      })

      context("and the event's target element *doesn't* contain the related (dragged) element", () => {
        beforeEach(() => {
          mockEvent = {
            relatedTarget,
            currentTarget: {
              contains: stub().withArgs(relatedTarget).returns(false),
            },
          }
          wrapper.simulate("dragLeave", mockEvent)
        })

        it("removes the dragged-over class", () => {
          expect(wrapper.find(".dragged-over").length).to.equal(0)
        })
      })
    })

    context("and an item is dropped on it", () => {
      let actions

      beforeEach(() => {
        actions = {
          submitIdeaEditAsync: spy(),
        }
      })

      context("and the data is a serialized idea", () => {
        let onDropOfIdeaSpy

        const idea = {
          id: 100,
          body: "sup",
          category: "sad",
          assignee_id: null,
        }

        const mockEvent = buildIdeaDragEvent(idea)

        beforeEach(() => {
          onDropOfIdeaSpy = spy()

          wrapper = mountWithConnectedSubcomponents(
            <IdeaDropTarget
              {...defaultProps}
              actions={actions}
              onDropOfIdea={onDropOfIdeaSpy}
            />
          )

          wrapper.simulate("dragEnter")
          wrapper.simulate("drop", mockEvent)
        })

        it("prevents the default event behavior", () => {
          expect(mockEvent.preventDefault).called
        })

        it("removes the dragged-over class", () => {
          expect(wrapper.find(".dragged-over").length).to.equal(0)
        })

        it("invokes the onDropOfIdea callback, passing the idea", () => {
          expect(onDropOfIdeaSpy).calledWith(idea)
        })
      })

      context("and there is not serialized idea data associated with the event", () => {
        const mockEvent = {
          preventDefault: () => {},
          dataTransfer: {
            getData: stub(),
          },
        }

        mockEvent.dataTransfer.getData
          .withArgs("idea").returns("")

        before(() => {
          wrapper = shallow(
            <IdeaDropTarget
              {...defaultProps}
              actions={actions}
            />
          )

          wrapper.simulate("drop", mockEvent)
        })

        it("does not invoke the submitIdeaEditAsync action", () => {
          expect(actions.submitIdeaEditAsync).not.called
        })
      })
    })
  })
})
