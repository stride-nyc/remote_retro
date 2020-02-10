import React from "react"
import { shallow, mount } from "enzyme"
import sinon from "sinon"

import { UserListItem } from "../../web/static/js/components/user_list_item"

const defaultUserAttrs = {
  given_name: "dylan",
  online_at: 803,
  is_typing: false,
  picture: "http://some/image.jpg?sz=200",
  id: 4,
}

const secondaryrUserAttrs = {
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
    updateRetroAsync: sinon.spy(),
  },
}

describe("UserListItem", () => {
  let wrapper
  let user

  describe("passed a facilitator user", () => {
    const user = { ...defaultUserAttrs, is_facilitator: true }

    it("renders a list item that labels the user the facilitator", () => {
      const wrapper = shallow(
        <UserListItem {...defaultProps} user={user} />
      )
      expect(wrapper.text()).to.match(/facilitator/i)
    })
  })

  describe("passed a non-facilitator user", () => {
    const user = { ...defaultUserAttrs, is_facilitator: false }

    it("renders a list item with no '(facilitator)' label", () => {
      const wrapper = shallow(
        <UserListItem {...defaultProps} user={user} />
      )
      expect(wrapper.text()).not.to.match(/dylan \(facilitator\)/i)
    })
  })

  describe("passed a non-facilitator user", () => {
    const facilitator = { ...defaultUserAttrs, is_facilitator: true }
    const nonFacilitator = { ...secondaryrUserAttrs, is_facilitator: false }

    it("renders a means of tranferring the facilitatorship to that user", () => {
      const wrapper = shallow(
        <UserListItem {...defaultProps} user={nonFacilitator} currentUser={facilitator} />
      )
      expect(wrapper.find("button.transferFacilitatorship")).to.have.length(1)
    })

    describe("passing facilitatorship", () => {
      beforeEach(() => {
        window.confirm = sinon.stub().returns(true)
      })

      it("calls the action to change facilitator", () => {
        const wrapper = shallow(
          <UserListItem {...defaultProps} user={nonFacilitator} currentUser={facilitator} />
        )
        wrapper.find("button.transferFacilitatorship").simulate("click")
        expect(defaultProps.actions.updateRetroAsync.calledWith(
          { facilitator_id: nonFacilitator.id }
        )).to.eql(true)
      })

      afterEach(() => {
        defaultProps.actions.updateRetroAsync.reset()
      })
    })

    describe("declining the passing of facilitatorship", () => {
      beforeEach(() => {
        window.confirm = sinon.stub().returns(false)
      })

      it("does not call the action to change facilitator", () => {
        const wrapper = shallow(
          <UserListItem {...defaultProps} user={nonFacilitator} currentUser={facilitator} />
        )
        wrapper.find("button.transferFacilitatorship").simulate("click")
        expect(defaultProps.actions.updateRetroAsync.notCalled).to.eql(true)
      })
    })

    afterEach(() => {
      defaultProps.actions.updateRetroAsync.reset()
    })
  })

  describe("the user in question is the facilitator", () => {
    const user = { ...defaultUserAttrs, is_facilitator: true }

    it("does not render a means of giving them the facilitatorship", () => {
      const wrapper = shallow(
        <UserListItem {...defaultProps} user={user} currentUser={user} />
      )
      expect(wrapper.find("button.transferFacilitatorship")).to.have.length(0)
    })
  })

  context("when the stage is not a voting stage", () => {
    context("when passed a user who *is* currently typing", () => {
      const user = { ...defaultUserAttrs, is_typing: true }

      it("renders the user with an ellipsis animation", () => {
        const wrapper = mount(
          <UserListItem
            {...defaultProps}
            user={user}
            isVotingStage={false}
          />
        )

        expect(wrapper.find("i.circle.icon")).to.have.length(3)
      })
    })

    context("when passed a user who is *not* currently typing", () => {
      const user = { ...defaultUserAttrs, is_typing: false }

      it("does not render the user with an ellipsis animation", () => {
        const wrapper = shallow(
          <UserListItem
            {...defaultProps}
            isVotingStage={false}
            user={user}
          />
        )
        expect(wrapper.find("i.circle.icon")).to.have.length(0)
      })
    })
  })

  it("changes the user's image url such that its `sz` query attribute's becomes 200", () => {
    user = { ...defaultUserAttrs, picture: "http://some/image.jpg?sz=50" }
    wrapper = shallow(<UserListItem {...defaultProps} user={user} />)
    const imageSrc = wrapper.find("img.picture").prop("src")
    expect(imageSrc).to.equal("http://some/image.jpg?sz=200")
  })

  context("when the stage is a voting stage", () => {
    it("does not render the animated ellipsis wrapper", () => {
      const wrapper = shallow(<UserListItem {...defaultProps} isVotingStage />)
      expect(wrapper.text()).to.not.match(/animatedellipsis/i)
    })

    it("renders a voting status span", () => {
      const wrapper = shallow(<UserListItem {...defaultProps} isVotingStage />)
      expect(wrapper.html()).to.contain("allVotesIn")
    })

    context("and the given user has more than 2 votes", () => {
      const userWithFiveVotes = { ...defaultUserAttrs, id: 999 }
      const voteForUser = { user_id: 999 }
      const votes = [voteForUser, voteForUser, voteForUser]

      it("renders an opaque span indicating that the user is done voting", () => {
        const wrapper = shallow(
          <UserListItem
            {...defaultProps}
            user={userWithFiveVotes}
            isVotingStage
            votes={votes}
          />
        )

        expect(wrapper.find(".allVotesIn").hasClass("opaque")).to.eql(true)
      })
    })

    context("and the given user has less than 3 votes", () => {
      const userWithFourVotes = { ...defaultUserAttrs, id: 999 }
      const voteForUser = { user_id: 999 }
      const votes = [voteForUser, voteForUser]

      it("does not apply opaqueness to text indicating that the user is done voting", () => {
        const wrapper = shallow(
          <UserListItem
            {...defaultProps}
            user={userWithFourVotes}
            isVotingStage
            votes={votes}
          />
        )

        expect(wrapper.find(".allVotesIn").hasClass("opaque")).to.eql(false)
      })
    })
  })
})
