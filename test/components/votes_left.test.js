import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { VotesLeft } from "../../web/static/js/components/votes_left"

describe("VotesLeft component", () => {
  const stubUser = {}

  test("renders 3 Votes Left for a user that hasn't voted yet", () => {
    render(
      <VotesLeft cumulativeVoteCountForUser={0} currentUser={stubUser} />
    )

    expect(screen.getByText(/3/)).toBeInTheDocument()
    expect(screen.getByText(/Votes Left/)).toBeInTheDocument()
  })

  test("renders the Votes Left (3 minus their votes) for the currentUser", () => {
    render(
      <VotesLeft cumulativeVoteCountForUser={1} currentUser={stubUser} />
    )

    expect(screen.getByText(/2/)).toBeInTheDocument()
    expect(screen.getByText(/Votes Left/)).toBeInTheDocument()
  })

  test("renders singular Vote if the user has one vote left", () => {
    render(
      <VotesLeft cumulativeVoteCountForUser={2} currentUser={stubUser} />
    )

    expect(screen.getByText(/1/)).toBeInTheDocument()
    expect(screen.getByText(/Vote Left/)).toBeInTheDocument()
  })
})
