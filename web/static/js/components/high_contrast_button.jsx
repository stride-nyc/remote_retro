import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/high_contrast_button.css"

const HighContrastButton = ({
  actions,
  userOptions,
  className = "",
}) => {
  const wrapperClasses = cx(className, styles.wrapper)

  return (
    <div className={wrapperClasses}>
      <button className="ui basic compact icon button" type="button" onClick={actions.toggleHighContrastOn}>
        <div className="ui toggle checkbox">
          <input type="checkbox" name="public" checked={userOptions.highContrastOn} readOnly />
          <label><i className="ui low vision icon" /> High Contrast</label>
        </div>
      </button>
    </div>
  )
}

HighContrastButton.propTypes = {
  actions: PropTypes.object.isRequired,
  userOptions: AppPropTypes.userOptions.isRequired,
  className: PropTypes.string.isRequired,
}

export default HighContrastButton
