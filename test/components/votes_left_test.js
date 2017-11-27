import React from "react"
import { shallow } from "enzyme"

import { VotesLeft } from "../../web/static/js/components/votes_left"

describe("VotesLeft component", () => {
  const user = { id: 5 }
  const voteForUser = { user_id: 5 }
  const voteForOtherUser = { user_id: 7 }

  it("renders 3 Votes Left for a user that hasn't voted yet", () => {
    const lowerThird = shallow(
      <VotesLeft currentUser={user} votes={[]} />
    )

    expect(lowerThird.text()).to.match(/3.*Votes Left/)
  })

  it("renders the Votes Left (3 minus their votes) for the currentUser", () => {
    const votes = [
      voteForUser,
      voteForOtherUser,
    ]

    const lowerThird = shallow(
      <VotesLeft currentUser={user} votes={votes} />
    )

    expect(lowerThird.text()).to.match(/2.*Votes Left/)
  })

  it("renders singular Vote if the user has one vote left", () => {
    const votes = [
      voteForUser,
      voteForUser,
    ]

    const lowerThird = shallow(
      <VotesLeft currentUser={user} votes={votes} />
    )

    expect(lowerThird.text()).to.match(/1.*Vote Left/)
  })
})
