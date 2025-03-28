import "@testing-library/jest-dom"
import { dragSourceSpec, collect } from "../../web/static/js/components/draggable_idea_content"

jest.mock("react-dnd", () => {
  return {
    DragSource: () => component => component,
    DropTarget: () => component => component,
    useDrag: () => [{}, () => {}],
    useDrop: () => [{}, () => {}],
    DndProvider: ({ children }) => children,
  }
})

describe("DraggableIdeaContent", () => {
  describe("dragSourceSpec", () => {
    describe("#beginDrag", () => {
      test("returns an object with a `draggedIdea` id and editable attributes", () => {
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

        expect(dragSourceSpec.beginDrag(props)).toEqual({
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
      test("returns false when the idea is in an edit state", () => {
        const props = {
          idea: {
            id: 666,
            inEditState: true,
          },
        }

        expect(dragSourceSpec.canDrag(props)).toEqual(false)
      })

      test("returns true when the idea is not in an edit state", () => {
        const props = {
          idea: {
            id: 666,
            inEditState: false,
          },
        }

        expect(dragSourceSpec.canDrag(props)).toEqual(true)
      })
    })

    describe("#endDrag", () => {
      let submitIdeaEditAsyncSpy

      beforeEach(() => {
        submitIdeaEditAsyncSpy = jest.fn()
      })

      describe("when the given idea has numeric x/y coordinates", () => {
        test("tells the server to persist the most up to date coordinates", () => {
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

          expect(submitIdeaEditAsyncSpy).toHaveBeenCalledWith({ id: 666, x: 0, y: 100 })
        })
      })

      describe("when the given idea *lacks* numeric x/y coordinates", () => {
        test("doesn't instruct the server to persist the most up to date coordinates", () => {
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

          expect(submitIdeaEditAsyncSpy).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe("collect", () => {
    let connectMock

    test("passes a custom drag preview func needed for changing the dragged idea's appearance mid-drag", () => {
      const dragPreviewStub = () => {}

      connectMock = {
        dragPreview: () => (dragPreviewStub),
        dragSource: jest.fn(),
      }

      const result = collect(connectMock)

      expect(Object.values(result)).toContain(dragPreviewStub)
    })

    test("passes the dragSource function returned by connect.dragSource", () => {
      const dragSourceStub = () => {}

      connectMock = {
        dragPreview: jest.fn(),
        dragSource: () => (dragSourceStub),
      }

      const result = collect(connectMock)

      expect(Object.values(result)).toContain(dragSourceStub)
    })
  })
})
