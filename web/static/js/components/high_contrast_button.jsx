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
      <button className="ui basic compact icon button" type="button" onClick={actions.toggleHighContrastOn}>
        <div className="ui toggle checkbox">
          <label htmlFor="high-contrast">
            <input 
              type="checkbox" 
              name="public" 
              id="high-contrast"
              checked={userOptions.highContrastOn} 
              readOnly 
            />
            <i className="ui low vision icon" /> High Contrast
          </label>
        </div>
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
