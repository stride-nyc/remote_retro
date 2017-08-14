import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import VoteCounter from "../../web/static/js/components/vote_counter"

describe("VoteCounter", () => {
  const idea = {
    category: "sad",
    body: "redundant tests",
    user_id: 1,
    user: {
      given_name: "Phil",
    },
    vote_count: 0,
  }

  it("renders an anchor tag that contains the vote count of the idea", () => {
    const voteCounter = shallow(
      <VoteCounter
        retroChannel={{}}
        idea={idea}
      />
    )
    const label = voteCounter.find("a")

    expect(label).to.have.length(1)
    expect(label.text()).to.equal(idea.vote_count.toString())
  })

  context("when buttonDisabled is false", () => {
    let voteCounter
    let button
    let label
    beforeEach(() => {
      voteCounter = shallow(
        <VoteCounter
          retroChannel={{}}
          idea={idea}
          buttonDisabled={false}
        />
      )
      button = voteCounter.find("button")
      label = voteCounter.find("a")
    })

    it("renders a green button and label", () => {
      expect(button.hasClass("green")).to.be.true
      expect(label.hasClass("green")).to.be.true
    })

    it("renders an enabled button", () => {
      expect(button.prop("disabled")).to.be.false
    })
  })

  context("when buttonDisabled is true", () => {
    let voteCounter
    let button
    let label
    beforeEach(() => {
      voteCounter = shallow(
        <VoteCounter
          retroChannel={{}}
          idea={idea}
          buttonDisabled
        />
      )
      button = voteCounter.find("button")
      label = voteCounter.find("a")
    })

    it("renders a grey button and label", () => {
      expect(button.hasClass("grey")).to.be.true
      expect(label.hasClass("grey")).to.be.true
    })

    it("renders an disabled button", () => {
      expect(button.prop("disabled")).to.be.true
    })
  })

  describe("handleClick", () => {
    it("calls retroChannel.push with 'submit_vote' and the idea's id", () => {
      const pushSpy = spy()
      const retroChannelMock = {
        push: pushSpy,
      }
      const voteCounter = shallow(
        <VoteCounter
          retroChannel={retroChannelMock}
          idea={idea}
        />
      )
      voteCounter.instance().handleClick()

      expect(pushSpy.calledWith("submit_vote", { id: idea.id })).to.be.true
    })
  })
})
