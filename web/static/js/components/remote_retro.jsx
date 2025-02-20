import React, { Component } from "react"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { actions, selectors } from "../redux"

import * as AppPropTypes from "../prop_types"

import ViewportMetaTag from "./viewport_meta_tag"
import Room from "./room"
import Alert from "./alert"
import Error from "./error"
import StageHelp from "./stage_help"

export class RemoteRetro extends Component {
  componentDidMount() {
    if (!window.DD_RUM) return

    DD_RUM.onReady(() => {
      DD_RUM.addTiming("SPA_MOUNTED")
    })
  }

  componentDidCatch(error) {
    if (!window.Honeybadger) return // protect against adblocker extensions blocking error tracking

    const { stage, presences, usersById } = this.props

    Honeybadger.setContext({ stage, presences, usersById })
    Honeybadger.notify(error)
  }

  render() {
    const {
      presences,
      ideas,
      groups,
      stage,
      alert = null,
      error = null,
      currentUser,
      facilitatorName = "",
      isTabletOrAbove,
      isAnActionItemsStage,
      stageConfig,
      ideaGenerationCategories,
      userOptions,
      browser,
      actions,
    } = this.props

    return (
      <div className={`stage ${stage}`}>
        <ViewportMetaTag
          stage={stage}
          alert={alert}
          browserOrientation={browser.orientation}
        />
        <Room
          currentUser={currentUser}
          facilitatorName={facilitatorName}
          presences={presences}
          ideaGenerationCategories={ideaGenerationCategories}
          userOptions={userOptions}
          ideas={ideas}
          groups={groups}
          stage={stage}
          stageConfig={stageConfig}
          actions={actions}
          browser={browser}
          isTabletOrAbove={isTabletOrAbove}
          isAnActionItemsStage={isAnActionItemsStage}
        />
        <Alert config={alert} />
        <Error config={error} />
        <StageHelp stageConfig={stageConfig} actions={actions} />
      </div>
    )
  }
}

RemoteRetro.propTypes = {
  presences: AppPropTypes.presences.isRequired,
  ideas: AppPropTypes.ideas.isRequired,
  groups: AppPropTypes.groups.isRequired,
  stage: AppPropTypes.stage.isRequired,
  alert: PropTypes.object,
  error: PropTypes.object,
  usersById: PropTypes.object.isRequired,
  actions: AppPropTypes.actions.isRequired,
  ideaGenerationCategories: AppPropTypes.ideaGenerationCategories.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  facilitatorName: PropTypes.string.isRequired,
  isTabletOrAbove: PropTypes.bool.isRequired,
  isAnActionItemsStage: PropTypes.bool.isRequired,
  stageConfig: AppPropTypes.stageConfig.isRequired,
  retro: AppPropTypes.retro.isRequired,
  browser: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  const { stage, facilitator_id } = state.retro /* eslint-disable-line camelcase */
  return {
    ...state,
    stage,
    currentUser: selectors.getCurrentUserPresence(state),
    facilitatorName: selectors.getUserById(state, facilitator_id).name,
    isTabletOrAbove: selectors.isTabletOrAbove(state),
    isAnActionItemsStage: selectors.isAnActionItemsStage(state),
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoteRetro)
