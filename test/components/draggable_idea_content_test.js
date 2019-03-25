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
  })

  describe("collect", () => {
    let monitorMock
    let connectMock
    it("passes the 'is dragging' state to the idea", () => {
      monitorMock = { isDragging: () => "stubResult" }
      connectMock = {
        dragPreview: sinon.stub(),
        dragSource: sinon.stub(),
      }

      const result = collect(connectMock, monitorMock)

      expect(result.isDragging).to.eql("stubResult")
    })

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
