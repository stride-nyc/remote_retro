import React from "react"
import { shallow } from "enzyme"
import { spy, stub } from "sinon"

import { CategoryColumn, mapStateToProps } from "../../web/static/js/components/category_column"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("CategoryColumn", () => {
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const defaultProps = {
    currentUser: { given_name: "daniel" },
    retroChannel: mockRetroChannel,
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
    const mockEvent = { preventDefault: spy(), dataTransfer: { dropEffect: null } }

    before(() => {
      const wrapper = shallow(
        <CategoryColumn
          {...defaultProps}
        />
      )

      wrapper.simulate("dragOver", mockEvent)
    })

    it("prevents the default event behavior", () => {
      expect(mockEvent.preventDefault.called).to.eql(true)
    })

    it("sets the accepted event dropEffect to 'move'", () => {
      expect(mockEvent.dataTransfer.dropEffect).to.eql("move")
    })
  })

  context("when a dragEnter event is fired", () => {
    let wrapper
    const mockEvent = { preventDefault: spy(), dataTransfer: { dropEffect: null } }

    beforeEach(() => {
      wrapper = shallow(
        <CategoryColumn
          {...defaultProps}
        />
      )

      wrapper.simulate("dragEnter", mockEvent)
    })

    it("adds a 'dragged-over' class", () => {
      expect(wrapper.find(".dragged-over").length).to.equal(1)
    })

    context("when a dragLeave event follows", () => {
      beforeEach(() => {
        wrapper.simulate("dragLeave", mockEvent)
      })

      it("removes the dragged-over class", () => {
        expect(wrapper.find(".dragged-over").length).to.equal(0)
      })
    })

    context("and an item is dropped on it", () => {
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

        const mockRetroChannel = { push: spy() }
        const category = "sad"

        beforeEach(() => {
          wrapper = mountWithConnectedSubcomponents(
            <CategoryColumn
              {...defaultProps}
              category={category}
              retroChannel={mockRetroChannel}
            />
          )

          wrapper.simulate("dragEnter")
          wrapper.simulate("drop", mockEvent)
        })

        it("prevents the default event behavior", () => {
          expect(mockEvent.preventDefault.called).to.eql(true)
        })

        it("pushes an idea_edited event w/ the idea's raw values, camelCased attributes, and its new category", () => {
          expect(mockRetroChannel.push.calledWith("idea_edited", {
            id: idea.id,
            body: idea.body,
            assigneeId: idea.assignee_id,
            category,
          })).to.eql(true)
        })

        it("removes the dragged-over class", () => {
          expect(wrapper.find(".dragged-over").length).to.equal(0)
        })
      })

      context("and there is no serialized idea data assciated with the event", () => {
        const mockEvent = {
          preventDefault: () => {},
          dataTransfer: {
            getData: stub(),
          },
        }

        mockEvent.dataTransfer.getData
          .withArgs("idea").returns("")

        const mockRetroChannel = { push: spy() }

        before(() => {
          const wrapper = shallow(
            <CategoryColumn
              {...defaultProps}
              retroChannel={mockRetroChannel}
            />
          )

          wrapper.simulate("drop", mockEvent)
        })

        it("does not push an idea_edited event", () => {
          expect(mockRetroChannel.push.called).to.eql(false)
        })
      })
    })
  })
})
