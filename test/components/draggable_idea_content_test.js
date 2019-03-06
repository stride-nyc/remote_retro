import { dragSourceSpec } from "../../web/static/js/components/draggable_idea_content"

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
})
