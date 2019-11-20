//
// Reusable, domain-specific prop types
//
import PropTypes from "prop-types"

import STAGES from "./configs/stages"

const {
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  GROUP_NAMING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
} = STAGES

export const alert = PropTypes.object

export const ideaGenerationCategories = PropTypes.arrayOf(PropTypes.string)

export const category = PropTypes.oneOf([
  "happy",
  "sad",
  "confused",
  "start",
  "stop",
  "continue",
  "action-item",
])

export const presence = PropTypes.shape({
  given_name: PropTypes.string,
  online_at: PropTypes.number,
})

export const presences = PropTypes.arrayOf(presence)

export const retroChannel = PropTypes.shape({
  on: PropTypes.func,
  push: PropTypes.func,
})

export const idea = PropTypes.shape({
  id: PropTypes.number,
  body: PropTypes.string,
  category,
})

export const stage = PropTypes.oneOf([
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  GROUP_NAMING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
])

export const stageConfig = PropTypes.object

export const categories = PropTypes.arrayOf(PropTypes.string)

export const votes = PropTypes.arrayOf(PropTypes.object)

export const groups = PropTypes.arrayOf(PropTypes.object)

export const ideas = PropTypes.arrayOf(idea)

export const groupWithAssociatedIdeas = PropTypes.shape({
  id: PropTypes.number,
  ideas,
})

export const actions = PropTypes.object

export const retro = PropTypes.shape({
  facilitator_id: PropTypes.number,
  id: PropTypes.string,
  inserted_at: PropTypes.string,
  stage,
  updated_at: PropTypes.string,
})

export const user = PropTypes.shape({
  is_facilitator: PropTypes.bool,
})

export const userOptions = PropTypes.shape({
  highContrastOn: PropTypes.bool,
})
