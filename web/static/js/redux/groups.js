import groupBy from "lodash/groupBy"

import actionTypes from "./action_types"

export const reducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE:
      return action.initialState.groups
    case actionTypes.RETRO_STAGE_PROGRESSION_COMMITTED:
      return action.payload.groups ? action.payload.groups : state
    default:
      return state
  }
}

export const selectors = {
  groupsWithAssociatedIdeasAndVotes: ({ groups, ideas, votes }) => {
    const ideasByGroupId = groupBy(ideas, "group_id")

    return groups.map(group => {
      const ideasForGroup = ideasByGroupId[group.id] || []
      const ideaIdsForGroup = new Set(ideasForGroup.map(idea => idea.id))

      const votesForGroup = votes.reduce((acc, vote) => {
        return ideaIdsForGroup.has(vote.idea_id) ? [...acc, vote] : acc
      }, [])

      return { ...group, ideas: ideasForGroup, votes: votesForGroup }
    })
  },
}

export const actionCreators = {
  submitGroupName: groupArguments => {
    return (dispatch, getState, retroChannel) => {
      retroChannel.push("update_group_name", groupArguments)
    }
  },
}
