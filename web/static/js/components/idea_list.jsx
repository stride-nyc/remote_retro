import React, { Component } from "react"
import countBy from "lodash/countBy"
import FlipMove from "react-flip-move"

import ShadowedScrollContainer from "./shadowed_scroll_container"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_list.css"
import STAGES from "../configs/stages"

const { VOTING, ACTION_ITEMS, CLOSED } = STAGES

const sortByVoteCountWithSecondarySortOnIdASC = (votes, ideas) => {
  const voteCountsByIdea = countBy(votes, "idea_id")
  return ideas.sort((a, b) => {
    const voteCountForIdeaA = voteCountsByIdea[a.id] || 0
    const voteCountForIdeaB = voteCountsByIdea[b.id] || 0

    if (voteCountForIdeaB === voteCountForIdeaA) { return a.id - b.id }

    return voteCountForIdeaB - voteCountForIdeaA
  })
}

class IdeaList extends Component {
  constructor(props) {
    super(props)
    const { stage, category } = props
    const sortByVotes =
      (stage === ACTION_ITEMS || stage === CLOSED) && category !== "action-item"

    this.state = {
      sortByVotes,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stage === VOTING && nextProps.stage === ACTION_ITEMS) {
      const timeout = setTimeout(() => {
        this.setState({ sortByVotes: true })
        clearTimeout(timeout)
      }, 2000)
    }
  }

  render() {
    const { props, state } = this
    const { category, ideas, votes } = props

    let sortedIdeas
    if (state.sortByVotes) {
      sortedIdeas = sortByVoteCountWithSecondarySortOnIdASC(votes, ideas)
    } else {
      sortedIdeas = ideas.sort((a, b) => a.id - b.id)
    }

    return (
      <ShadowedScrollContainer>
        <FlipMove
          duration={750}
          staggerDelayBy={100}
          disableAllAnimations={!state.sortByVotes}
          easing="ease"
          enterAnimation="none"
          leaveAnimation="none"
          className={`${category} ${styles.list} ideas`}
          typeName="ul"
        >
          {sortedIdeas.map(idea => <Idea {...this.props} idea={idea} key={idea.id} />)}
        </FlipMove>
      </ShadowedScrollContainer>
    )
  }
}

IdeaList.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

export default IdeaList
