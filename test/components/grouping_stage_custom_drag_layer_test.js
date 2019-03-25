import React from "react"
import { shallow } from "enzyme"

import { GroupingStageCustomDragLayer } from "../../web/static/js/components/grouping_stage_custom_drag_layer"

describe("<GroupingStageCustomDragLayer />", () => {
  let wrapper
  let props
  let styleProp

  describe("when an idea is being dragged", () => {
    describe("and there is a current offset value passed", () => {
      describe("and there is an initial offset value passed", () => {
        before(() => {
          props = {
            isDragging: true,
            currentOffset: { x: 15, y: 101.5 },
            initialOffset: { x: 0, y: 0 },
            item: { draggedIdea: {} },
          }
          wrapper = shallow(<GroupingStageCustomDragLayer {...props} />)
          styleProp = wrapper.find("div").first().prop("style")
        })

        it("applies display: inline-block styling", () => {
          expect(styleProp.display).to.eql("inline-block")
        })

        it("maps the currentOffset values to transform: translate", () => {
          expect(styleProp.transform).to.eql("translate(15px, 101.5px)")
        })

        it("maps the currentOffset values to transform: translate", () => {
          expect(styleProp.WebkitTransform).to.eql("translate(15px, 101.5px)")
        })
      })

      describe("but there is no initial offset value", () => {
        beforeEach(() => {
          props = {
            isDragging: true,
            currentOffset: { x: 15, y: 101.5 },
            initialOffset: null,
            item: { draggedIdea: {} },
          }

          wrapper = shallow(<GroupingStageCustomDragLayer {...props} />)
        })

        it("does not render a custom drag layer", () => {
          expect(wrapper.html()).to.eql(null)
        })
      })
    })

    describe("and no current offset value is passed ", () => {
      describe("and there is an initial offset value passed", () => {
        before(() => {
          props = {
            isDragging: true,
            currentOffset: null,
            initialOffset: { x: 0, y: 0 },
            item: { draggedIdea: {} },
          }

          wrapper = shallow(<GroupingStageCustomDragLayer {...props} />)
        })

        it("does not render a custom drag layer", () => {
          expect(wrapper.html()).to.eql(null)
        })
      })
    })
  })

  describe("when an idea is *not* being dragged", () => {
    describe("and there are current and initial offsets passed", () => {
      before(() => {
        props = {
          isDragging: false,
          currentOffset: { x: 15, y: 101.5 },
          initialOffset: { x: 0, y: 0 },
          item: { draggedIdea: {} },
        }
        wrapper = shallow(<GroupingStageCustomDragLayer {...props} />)
      })

      it("does not render a custom drag layer", () => {
        expect(wrapper.html()).to.eql(null)
      })
    })
  })
})
