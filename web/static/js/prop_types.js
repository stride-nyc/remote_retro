//
// Reusable, domain-specific prop types
//
import PropTypes from "prop-types"

import STAGES from "../js/configs/stages"
import { CATEGORIES as startingCategories } from "../js/configs/retro_configs"

const {
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
} = STAGES

export const alert = PropTypes.object

export const category = PropTypes.oneOf([
  ...startingCategories,
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
  VOTING,
  ACTION_ITEMS,
  CLOSED,
])

export const categories = PropTypes.arrayOf(PropTypes.string)

export const votes = PropTypes.arrayOf(PropTypes.object)

export const ideas = PropTypes.arrayOf(idea)

export const actions = PropTypes.object

