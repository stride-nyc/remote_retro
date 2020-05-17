import { combineReducers } from "redux"
import { responsiveStateReducer } from "redux-responsive"

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
  reducer as groups,
  selectors as groupSelectors,
  actionCreators as groupActionCreators,
} from "./groups"

import {
  actions as retroActions,
  reducer as retro,
  selectors as retroSelectors,
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
  actions as usersByIdActions,
} from "./users_by_id"

import {
  reducer as mobile,
  actions as mobileActions,
} from "./mobile"

import {
  reducer as stageConfig,
} from "./stage_config"

import {
  reducer as ideaGenerationCategories,
} from "./idea_generation_categories"

import {
  actions as userOptionsActions,
  reducer as userOptions,
} from "./user_options"

export const reducer = combineReducers({
  presences,
  usersById,
  ideas,
  groups,
  votes,
  alert,
  retro,
  error,
  mobile,
  stageConfig,
  ideaGenerationCategories,
  userOptions,
  browser: responsiveStateReducer,
})

export const actions = {
  ...alertActions,
  ...errorActions,
  ...presenceActions,
  ...ideaActions,
  ...retroActions,
  ...mobileActions,
  ...voteActions,
  ...userOptionsActions,
  ...usersByIdActions,
  ...groupActionCreators,
}

export const selectors = {
  ...presenceSelectors,
  ...usersByIdSelectors,
  ...groupSelectors,
  ...voteSelectors,
  ...retroSelectors,
  isTabletOrAbove: ({ browser }) => {
    return browser.greaterThan.small
  },
}
