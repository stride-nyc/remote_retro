import React, { Component } from "react"
import countBy from "lodash/countBy"

import IdeaList from "./idea_list"
import * as AppPropTypes from "../prop_types"
import STAGES from "../configs/stages"

const { ACTION_ITEMS, CLOSED } = STAGES

const sortByVoteCountWithSecondarySortOnIdASC = (votes, ideas) => {
  const voteCountsByIdea = countBy(votes, "idea_id")
  return ideas.sort((a, b) => {
    const voteCountForIdeaA = voteCountsByIdea[a.id] || 0
    const voteCountForIdeaB = voteCountsByIdea[b.id] || 0

    if (voteCountForIdeaB === voteCountForIdeaA) { return a.id - b.id }

    return voteCountForIdeaB - voteCountForIdeaA
  })
}

class IdeaColumnListContainer extends Component {
  constructor(props) {
    super(props)
    const { stage, category } = props
    const sortByVotes = (stage === ACTION_ITEMS || stage === CLOSED) && category !== "action-item"

    this.state = {
      sortByVotes,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { stage, alert } = this.props
    const actionItemsStageChangeAlertCleared = stage === ACTION_ITEMS && alert && !nextProps.alert

    if (actionItemsStageChangeAlertCleared) {
      this.setState({ sortByVotes: true })
    }
  }

  render() {
    const { props, state } = this
    const { ideas, votes } = props

    let sortedIdeas
    if (state.sortByVotes) {
      sortedIdeas = sortByVoteCountWithSecondarySortOnIdASC(votes, ideas)
    } else {
      sortedIdeas = ideas.sort((a, b) => a.id - b.id)
    }

    return (
      <IdeaList
        {...props}
        ideas={sortedIdeas}
      />
    )
  }
}

IdeaColumnListContainer.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
  alert: AppPropTypes.alert,
}

IdeaColumnListContainer.defaultProps = {
  alert: null,
}

export default IdeaColumnListContainer
