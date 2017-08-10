import React from "react"
import { shallow, mount } from "enzyme"
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

  it("renders a button that says Vote", () => {
    const voteCounter = shallow(
      <VoteCounter
        retroChannel={{}}
        idea={idea}
      />
    )
    const button = voteCounter.find("button")

    expect(button).to.have.length(1)
    expect(button.text()).to.equal("Vote")
  })

  it("renders a pointing label that contains the vote count of the idea", () => {
    const voteCounter = shallow(
       <VoteCounter
         retroChannel={{}}
         idea={idea}
       />
    )
    const label = voteCounter.find("a")

    expect(label).to.have.length(1)
    expect(label.hasClass("pointing label")).to.be.true
    expect(label.text()).to.equal(idea.vote_count.toString())
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
