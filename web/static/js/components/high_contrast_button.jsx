import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/high_contrast_button.css"

const HighContrastButton = props => {
  const { actions, userOptions, className } = props

  const wrapperClasses = cx(className, styles.wrapper)

  return (
    <div className={wrapperClasses}>
      <button
        className="ui right labeled black basic icon button"
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
  className: PropTypes.string,
}

HighContrastButton.defaultProps = {
  className: "",
}

export default HighContrastButton
