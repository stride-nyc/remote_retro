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
  const mockUser = { id: 55 }

  it("renders an anchor tag that contains the vote count of the idea", () => {
    const voteCounter = mount(
      <VoteCounter
        retroChannel={{}}
        idea={idea}
        currentUser={mockUser}
      />
    )
    const label = voteCounter.find("a")

    expect(label).to.have.length(1)
    expect(label.text()).to.equal(idea.vote_count.toString())
  })

  context("when buttonDisabled is true", () => {
    let voteCounter
    beforeEach(() => {
      voteCounter = shallow(
        <VoteCounter
          retroChannel={{}}
          idea={idea}
          buttonDisabled
          currentUser={mockUser}
        />
      )
    })

    it("renders a disabled VoteCounter", () => {
      expect(voteCounter.hasClass("disabled")).to.be.true
    })
  })

  describe("handleClick", () => {
    it("calls retroChannel.push with 'submit_vote', the idea's id, and the user id", () => {
      const pushSpy = spy()
      const retroChannelMock = {
        push: pushSpy,
      }
      const voteCounter = shallow(
        <VoteCounter
          retroChannel={retroChannelMock}
          idea={idea}
          currentUser={mockUser}
        />
      )
      voteCounter.instance().handleClick()

      expect(pushSpy.calledWith("submit_vote", { ideaId: idea.id, userId: mockUser.id })).to.be.true
    })
  })
})
