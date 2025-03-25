import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

import { UserListItem } from "../../web/static/js/components/user_list_item"

const defaultUserAttrs = {
  given_name: "dylan",
  online_at: 803,
  is_typing: false,
  picture: "http://some/image.jpg?sz=200",
  id: 4,
}

const secondaryUserAttrs = {
  given_name: "xion",
  online_at: 805,
  is_typing: false,
  picture: "http://some/image.jpg?sz=200",
  id: 5,
}

const defaultProps = {
  votes: [],
  user: defaultUserAttrs,
  isVotingStage: false,
  currentUser: defaultUserAttrs,
  actions: {
    updateRetroAsync: jest.fn(),
  },
}

describe("UserListItem", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("passed a facilitator user", () => {
    const user = { ...defaultUserAttrs, is_facilitator: true }

    it("renders a list item that labels the user the facilitator", () => {
      render(<UserListItem {...defaultProps} user={user} />)
      expect(screen.getByText(/facilitator/i)).toBeInTheDocument()
    })
  })

  describe("passed a non-facilitator user", () => {
    const user = { ...defaultUserAttrs, is_facilitator: false }

    it("renders a list item with no '(facilitator)' label", () => {
      render(<UserListItem {...defaultProps} user={user} />)
      expect(screen.queryByText(/dylan \(facilitator\)/i)).not.toBeInTheDocument()
    })
  })

  describe("passed a non-facilitator user", () => {
    const facilitator = { ...defaultUserAttrs, is_facilitator: true }
    const nonFacilitator = { ...secondaryUserAttrs, is_facilitator: false }

    it("renders a means of transferring the facilitatorship to that user", () => {
      render(
        <UserListItem {...defaultProps} user={nonFacilitator} currentUser={facilitator} />
      )
      expect(screen.getByRole("button", { name: /transfer facilitatorship to xion/i })).toBeInTheDocument()
    })

    describe("passing facilitatorship", () => {
      beforeEach(() => {
        window.confirm = jest.fn().mockReturnValue(true)
      })

      it("calls the action to change facilitator", () => {
        render(
          <UserListItem {...defaultProps} user={nonFacilitator} currentUser={facilitator} />
        )
        fireEvent.click(screen.getByRole("button", { name: /transfer facilitatorship to xion/i }))
        expect(defaultProps.actions.updateRetroAsync).toHaveBeenCalledWith(
          { facilitator_id: nonFacilitator.id }
        )
      })
    })

    describe("declining the passing of facilitatorship", () => {
      beforeEach(() => {
        window.confirm = jest.fn().mockReturnValue(false)
      })

      it("does not call the action to change facilitator", () => {
        render(
          <UserListItem {...defaultProps} user={nonFacilitator} currentUser={facilitator} />
        )
        fireEvent.click(screen.getByRole("button", { name: /transfer facilitatorship to xion/i }))
        expect(defaultProps.actions.updateRetroAsync).not.toHaveBeenCalled()
      })
    })
  })

  describe("the user in question is the facilitator", () => {
    const user = { ...defaultUserAttrs, is_facilitator: true }

    it("does not render a means of giving them the facilitatorship", () => {
      render(
        <UserListItem {...defaultProps} user={user} currentUser={user} />
      )
      expect(screen.queryByRole("button", { name: /transfer facilitatorship/i })).not.toBeInTheDocument()
    })
  })

  describe("when the stage is not a voting stage", () => {
    describe("when passed a user who *is* currently typing", () => {
      const user = { ...defaultUserAttrs, is_typing: true }

      it("renders the user with an ellipsis animation", () => {
        const { container } = render(
          <UserListItem
            {...defaultProps}
            user={user}
            isVotingStage={false}
          />
        )

        const circleIcons = container.querySelectorAll("i.circle.icon")
        expect(circleIcons.length).toBe(3)
      })
    })

    describe("when passed a user who is *not* currently typing", () => {
      const user = { ...defaultUserAttrs, is_typing: false }

      it("does not render the user with an animated ellipsis", () => {
        const { container } = render(
          <UserListItem
            {...defaultProps}
            isVotingStage={false}
            user={user}
          />
        )
        // The AnimatedEllipsis component always renders 3 circle icons,
        // but they're only animated when the 'animated' prop is true
        const animatedElement = container.querySelector("[class*='animated']")
        expect(animatedElement).toBeNull()
      })
    })
  })

  it("changes the user's image url such that its `sz` query attribute's becomes 200", () => {
    const user = { ...defaultUserAttrs, picture: "http://some/image.jpg?sz=50" }
    render(<UserListItem {...defaultProps} user={user} />)
    const image = screen.getByAltText(user.given_name)
    expect(image.src).toBe("http://some/image.jpg?sz=200")
  })

  describe("when the stage is a voting stage", () => {
    it("does not render the animated ellipsis wrapper", () => {
      render(<UserListItem {...defaultProps} isVotingStage />)
      expect(screen.queryByText(/animatedellipsis/i)).not.toBeInTheDocument()
    })

    it("renders a voting status span", () => {
      render(<UserListItem {...defaultProps} isVotingStage />)
      expect(screen.getByText("ALL VOTES IN")).toBeInTheDocument()
    })

    describe("and the given user has more than 2 votes", () => {
      const userWithThreeVotes = { ...defaultUserAttrs, id: 999 }
      const voteForUser = { user_id: 999 }
      const votes = [voteForUser, voteForUser, voteForUser]

      it("renders an opaque span indicating that the user is done voting", () => {
        render(
          <UserListItem
            {...defaultProps}
            user={userWithThreeVotes}
            isVotingStage
            votes={votes}
          />
        )

        const allVotesInElement = screen.getByText("ALL VOTES IN")
        expect(allVotesInElement).toHaveClass("opaque")
      })
    })

    describe("and the given user has less than 3 votes", () => {
      const userWithTwoVotes = { ...defaultUserAttrs, id: 999 }
      const voteForUser = { user_id: 999 }
      const votes = [voteForUser, voteForUser]

      it("does not apply opaqueness to text indicating that the user is done voting", () => {
        render(
          <UserListItem
            {...defaultProps}
            user={userWithTwoVotes}
            isVotingStage
            votes={votes}
          />
        )

        const allVotesInElement = screen.getByText("ALL VOTES IN")
        expect(allVotesInElement).not.toHaveClass("opaque")
      })
    })
  })
})
