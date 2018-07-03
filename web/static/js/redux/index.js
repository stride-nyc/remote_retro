import { combineReducers } from "redux"

import {
  actions as presenceActions,
  reducer as presences,
  selectors as presenceSelectors,
} from "./presences"

import {
  actions as ideaActions,
  reducer as ideas,
} from "./ideas"

import {
  actions as retroActions,
} from "./retro"

import {
  actions as voteActions,
  reducer as votes,
  selectors as voteSelectors,
} from "./votes"

import {
  actions as alertActions,
  reducer as alert,
} from "./alert"

import {
  actions as errorActions,
  reducer as error,
} from "./error"

import {
  reducer as usersById,
  selectors as usersByIdSelectors,
} from "./users_by_id"

import { reducer as stage } from "./stage"
import { reducer as insertedAt } from "./inserted_at"
import { reducer as facilitatorId } from "./facilitator_id"

export const reducer = combineReducers({
  presences,
  usersById,
  ideas,
  votes,
  stage,
  facilitatorId,
  insertedAt,
  alert,
  error,
})

export const actions = {
  ...alertActions,
  ...errorActions,
  ...presenceActions,
  ...ideaActions,
  ...retroActions,
  ...voteActions,
}

export const selectors = {
  ...presenceSelectors,
  ...usersByIdSelectors,
  ...voteSelectors,
}
