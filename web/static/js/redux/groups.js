import groupBy from "lodash/groupBy"

import actionTypes from "./action_types"

export const reducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE:
      return action.initialState.groups
    case actionTypes.RETRO_STAGE_PROGRESSION_COMMITTED:
      return action.payload.groups ? action.payload.groups : state
    case actionTypes.GROUP_UPDATE_COMMITTED:
      return state.map(group => {
        return group.id === action.updatedGroup.id
          ? { ...group, ...action.updatedGroup, updatedGroupLabelId: action.updatedGroup.id }
          : group
      })
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
  submitGroupLabelChanges: (existingGroup, groupLabelInputValue) => {
    return (dispatch, getState, retroChannel) => {
      if (existingGroup.label === groupLabelInputValue) return

      const push = retroChannel.push("group_edited", {
        id: existingGroup.id,
        label: groupLabelInputValue,
      })

      push.receive("error", () => {
        dispatch({ type: actionTypes.GROUP_UPDATE_REJECTED })
      })
    }
  },
  updateGroup: updatedGroup => {
    return {
      type: actionTypes.GROUP_UPDATE_COMMITTED,
      updatedGroup,
    }
  },
}
