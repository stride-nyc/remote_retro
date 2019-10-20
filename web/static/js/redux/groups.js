import groupBy from "lodash/groupBy"

import { types as retroTypes } from "./retro"

export const reducer = (state = [], action) => {
  switch (action.type) {
    case retroTypes.SET_INITIAL_STATE:
      return action.initialState.groups
    case retroTypes.RETRO_STAGE_PROGRESSION_COMMITTED:
      return action.payload.groups ? action.payload.groups : state
    default:
      return state
  }
}

export const selectors = {
  groupsWithAssociatedIdeas: ({ groups, ideas }) => {
    const ideasByGroupId = groupBy(ideas, "group_id")

    return groups.map(group => {
      const ideasForGroup = ideasByGroupId[group.id] || []
      return { ...group, ideas: ideasForGroup }
    })
  },
}
