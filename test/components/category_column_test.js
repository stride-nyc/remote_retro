import React from "react"
import { shallow } from "enzyme"
import { spy, stub } from "sinon"

import { CategoryColumn, mapStateToProps } from "../../web/static/js/components/category_column"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("CategoryColumn", () => {
  let wrapper
  const mockActions = { submitIdeaEditAsync: () => {} }
  const defaultProps = {
    currentUser: { given_name: "daniel" },
    actions: mockActions,
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
  }

  describe("mapStateToProps", () => {
    context("when every idea passed in the ideas prop matches the column's category", () => {
      it("returns all of those ideas in the props", () => {
        const ideas = [{
          id: 1,
          body: "tests!",
          category: "happy",
        }, {
          id: 2,
          body: "winter break!",
          category: "happy",
        }]

        const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
        expect(resultingProps.ideas).to.deep.equal(ideas)
      })
    })

    context("when an idea passed in the ideas prop fails to match the column's category", () => {
      it("excludes that idea from the returned array of ideas passes as props", () => {
        const ideas = [{
          id: 1,
          body: "still no word on tests",
          category: "confused",
        }, {
          id: 2,
          body: "fassssst build",
          category: "happy",
        }]

        const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
        expect(resultingProps.ideas).to.deep.equal([{
          id: 2,
          body: "fassssst build",
          category: "happy",
        }])
      })
    })
  })

  context("when an item is dragged over it", () => {
    let mockEvent

    before(() => {
      mockEvent = { preventDefault: spy(), dataTransfer: { dropEffect: null } }

      wrapper = shallow(
        <CategoryColumn
          {...defaultProps}
        />
      )

      wrapper.simulate("dragOver", mockEvent)
    })

    it("prevents the default event behavior", () => {
      expect(mockEvent.preventDefault.called).to.eql(true)
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

      context("and the event's target element *doesn't* contain the related (dragged) elemant", () => {
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

      context("and the data is a serialized idea with snake_cased attributes", () => {
        const idea = {
          id: 100,
          body: "sup",
          category: "sad",
          assignee_id: null,
        }

        const serializedIdea = JSON.stringify(idea)

        const mockEvent = {
          preventDefault: spy(),
          dataTransfer: {
            getData: stub(),
          },
        }

        mockEvent.dataTransfer.getData
          .withArgs("idea").returns(serializedIdea)

        const category = "sad"

        beforeEach(() => {
          wrapper = mountWithConnectedSubcomponents(
            <CategoryColumn
              {...defaultProps}
              category={category}
              actions={actions}
            />
          )

          wrapper.simulate("dragEnter")
          wrapper.simulate("drop", mockEvent)
        })

        it("prevents the default event behavior", () => {
          expect(mockEvent.preventDefault.called).to.eql(true)
        })

        it("pushes an idea_edited event w/ the idea's raw values, camelCased attributes, and its new category", () => {
          expect(
            actions.submitIdeaEditAsync.calledWith({
              id: idea.id,
              body: idea.body,
              assignee_id: idea.assignee_id,
              category,
            })
          ).to.eql(true)
        })

        it("removes the dragged-over class", () => {
          expect(wrapper.find(".dragged-over").length).to.equal(0)
        })
      })

      context("and there is not serialized idea data assciated with the event", () => {
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
            <CategoryColumn
              {...defaultProps}
              actions={actions}
            />
          )

          wrapper.simulate("drop", mockEvent)
        })

        it("does not invoke the submitIdeaEditAsync action", () => {
          expect(actions.submitIdeaEditAsync.called).to.eql(false)
        })
      })
    })
  })
})
