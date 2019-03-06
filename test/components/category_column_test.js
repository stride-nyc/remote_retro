import { spy } from "sinon"

import { mapStateToProps, dropTargetSpec } from "../../web/static/js/components/category_column"

describe("CategoryColumn", () => {
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

  describe("dropTargetSpec", () => {
    describe("#drop", () => {
      let actions
      let mockDragMonitor
      let categoryColumnProps

      beforeEach(() => {
        mockDragMonitor = {
          getItem: () => ({
            draggedIdea: {
              id: 66,
              category: "confused",
            },
          }),
        }

        actions = {
          submitIdeaEditAsync: spy(),
        }
      })

      context("when the columns category differ's from the draggedIdea's category", () => {
        beforeEach(() => {
          categoryColumnProps = {
            category: "sad",
            actions,
          }
        })

        it("invokes submitIdeaEditAsync with the given idea but the column's category", () => {
          dropTargetSpec.drop(categoryColumnProps, mockDragMonitor)
          expect(actions.submitIdeaEditAsync).to.have.been.calledWith({
            id: 66,
            category: "sad",
          })
        })
      })

      context("when the draggedIdea belongs to the *same* category as the column", () => {
        beforeEach(() => {
          categoryColumnProps = {
            category: "confused",
            actions,
          }
        })

        it("does *not* invoke submitIdeaEditAsync", () => {
          dropTargetSpec.drop(categoryColumnProps, mockDragMonitor)
          expect(actions.submitIdeaEditAsync).to.not.have.been.called
        })
      })
    })
  })
})
