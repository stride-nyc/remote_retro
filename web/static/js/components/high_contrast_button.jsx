import React from "react"
import PropTypes from "prop-types"
import * as AppPropTypes from "../prop_types"

const HighContrastButton = props => {
  const {actions, userOptions, className} = props

  return (
    <div className={className}>
      <button
        className="ui right labeled icon button"
        onClick={actions.toggleHighContrastOn}
        type="button"
      >
        {`Turn High Contrast ${userOptions.highContrastOn ? "Off" : "On"}`}
        <i className="ui low vision icon" />
      </button>
    </div>
  )
}

HighContrastButton.propTypes = {
  actions: PropTypes.object.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
  className: PropTypes.string
}

export default HighContrastButton
