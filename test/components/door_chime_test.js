import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import DoorChime from "../../web/static/js/components/door_chime"

describe("DoorChime component", () => {
  let audioElement

  describe("the underlying audio element", () => {
    let clock

    beforeEach(() => {
      clock = sinon.useFakeTimers()
      audioElement = mount(<DoorChime users={[]} />).getDOMNode()
    })

    it("is muted on component mount", () => {
      expect(audioElement.muted).to.equal(true)
    })

    it("is unmuted after a timeout to allow the initial users list to render unheard", () => {
      clock.tick(1600)
      expect(audioElement.muted).to.equal(false)
      clock.restore()
    })
  })

  describe(".componentWillReceiveProps", () => {
    let doorChimeWrapper

    beforeEach(() => {
      doorChimeWrapper = mount(<DoorChime users={[]} />)
      audioElement = doorChimeWrapper.getDOMNode()
      audioElement.play = sinon.spy()
    })

    describe("when the audio element has a non-zero readyState", () => {
      it("plays chime when the user list length changes", () => {
        Object.defineProperty(audioElement, "readyState", {
          get() { return 5 },
        })

        expect(audioElement.play.called).to.equal(false)
        doorChimeWrapper.setProps({ users: [{ name: "Hilly" }] })
        expect(audioElement.play.called).to.equal(true)
      })
    })

    describe("when the audio element has a readyState of zero", () => {
      it("does not play the chime sound when the user list length changes", () => {
        Object.defineProperty(audioElement, "readyState", {
          get() { return 0 },
        })

        doorChimeWrapper.setProps({ users: [{ name: "Danny" }] })
        expect(audioElement.play.called).to.equal(false)
      })
    })
  })
})
