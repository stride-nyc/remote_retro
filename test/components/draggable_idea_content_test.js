import sinon from "sinon"
import { dragSourceSpec, collect } from "../../web/static/js/components/draggable_idea_content"

describe("DraggableIdeaContent", () => {
  describe("dragSourceSpec", () => {
    describe("#beginDrag", () => {
      it("returns an object with a `draggedIdea` id and editable attributes", () => {
        const props = {
          idea: {
            id: 666,
            category: "sad",
            body: "I like turtles, but there are none around",
            assignee_id: null,
            inserted_at: 383838383838,
            updated_at: 383838383838,
          },
        }

        expect(dragSourceSpec.beginDrag(props)).to.eql({
          draggedIdea: {
            id: 666,
            category: "sad",
            body: "I like turtles, but there are none around",
            assignee_id: null,
          },
        })
      })
    })

    describe("#canDrag", () => {
      it("returns false when the idea is in an edit state", () => {
        const props = {
          idea: {
            id: 666,
            inEditState: true,
          },
        }

        expect(dragSourceSpec.canDrag(props)).to.eql(false)
      })

      it("returns true when the idea is not in an edit state", () => {
        const props = {
          idea: {
            id: 666,
            inEditState: false,
          },
        }

        expect(dragSourceSpec.canDrag(props)).to.eql(true)
      })
    })

    describe("#endDrag", () => {
      let submitIdeaEditAsyncSpy

      beforeEach(() => {
        submitIdeaEditAsyncSpy = sinon.spy()
      })

      describe("when the given idea has numeric x/y coordinates", () => {
        it("tells the server to persist the most up to date coordinates", () => {
          const props = {
            idea: {
              id: 666,
              x: 0,
              y: 100,
            },
            actions: {
              submitIdeaEditAsync: submitIdeaEditAsyncSpy,
            },
          }

          dragSourceSpec.endDrag(props)

          expect(submitIdeaEditAsyncSpy).to.have.been.calledWith({ id: 666, x: 0, y: 100 })
        })
      })

      describe("when the given idea *lacks* numeric x/y coordinates", () => {
        it("doesn't instruct the server to persist the most up to date coordinates", () => {
          const props = {
            idea: {
              id: 666,
              x: undefined,
              y: undefined,
            },
            actions: {
              submitIdeaEditAsync: submitIdeaEditAsyncSpy,
            },
          }

          dragSourceSpec.endDrag(props)

          expect(submitIdeaEditAsyncSpy).to.not.have.been.called
        })
      })
    })
  })

  describe("collect", () => {
    let monitorMock
    let connectMock

    it("passes a custom drag preview func needed for changing the dragged idea's appearance mid-drag", () => {
      const dragPreviewStub = () => {}

      monitorMock = { isDragging: sinon.stub() }
      connectMock = {
        dragPreview: () => (dragPreviewStub),
        dragSource: sinon.stub(),
      }

      const result = collect(connectMock, monitorMock)

      expect(Object.values(result)).to.contain(dragPreviewStub)
    })

    it("passes the dragSource function returned by connect.dragSource", () => {
      const dragSourceStub = () => {}

      monitorMock = { isDragging: sinon.stub() }
      connectMock = {
        dragPreview: sinon.stub(),
        dragSource: () => (dragSourceStub),
      }

      const result = collect(connectMock, monitorMock)

      expect(Object.values(result)).to.contain(dragSourceStub)
    })
  })
})
