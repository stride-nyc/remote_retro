import React from "react"
import { shallow } from "enzyme"

import VotesLeft from "../../web/static/js/components/votes_left"
import { voteMax } from "../../web/static/js/configs/retro_configs"

describe("VotesLeft component", () => {
  const stubUser = { given_name: "Mugatu", vote_count: 0 }

  it("renders 5 Votes Left for a user that hasn't voted yet", () => {
    const lowerThird = shallow(
      <VotesLeft currentUser={stubUser} />
    )

    expect(lowerThird.text()).to.match(/5.*Votes Left/)
  })

  it("renders the Votes Left for the currentUser", () => {
    const userWithFiveVotes = {
      is_facilitator: false,
      vote_count: voteMax,
    }

    const lowerThird = shallow(
      <VotesLeft currentUser={userWithFiveVotes} />
    )

    expect(lowerThird.text()).to.match(/0.*Votes Left/)
  })

  it("renders singular Vote if the user has one vote left", () => {
    const userWithFourVotes = {
      is_facilitator: false,
      vote_count: voteMax - 1,
    }
    const lowerThird = shallow(
      <VotesLeft currentUser={userWithFourVotes} />
    )

    expect(lowerThird.text()).to.match(/1.*Vote Left/)
  })
})
