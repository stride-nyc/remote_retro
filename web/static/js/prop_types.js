//
// Reusable, domain-specific prop types
//
import PropTypes from "prop-types"

import STAGES from "../js/configs/stages"

const { LOBBY, PRIME_DIRECTIVE, IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

export const alert = PropTypes.object

// could be an enum if this is a fixed set of strings?
export const category = PropTypes.string

export const user = PropTypes.shape({
  given_name: PropTypes.string,
  online_at: PropTypes.number,
  is_facilitator: PropTypes.boolean,
})

export const users = PropTypes.arrayOf(user)

export const retroChannel = PropTypes.shape({
  on: PropTypes.func,
  push: PropTypes.func,
})

export const idea = PropTypes.shape({
  id: PropTypes.number,
  user: PropTypes.object,
  body: PropTypes.string,
  category,
})

export const stage = PropTypes.oneOf([
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
])

export const categories = PropTypes.arrayOf(PropTypes.string)

export const votes = PropTypes.arrayOf(PropTypes.object)

export const ideas = PropTypes.arrayOf(idea)

