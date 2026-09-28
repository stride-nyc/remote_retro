import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/high_contrast_button.css"

function HighContrastButton(props) {
  const { actions, userOptions, className } = props

  const wrapperClasses = cx(className, styles.wrapper)

  return (
    <div className={wrapperClasses}>
      <button className="ui basic compact icon button" type="button">
        <div className="ui toggle checkbox">
          {/*
            a label with htmlFor forwards a native click to its associated
            control - putting the toggle action on this button too (as a
            shared ancestor) would double-fire it per click, canceling out
            the state change. the checkbox's own onChange is the single
            source of truth instead.
          */}
          <input
            id="high-contrast-toggle"
            type="checkbox"
            name="public"
            checked={userOptions.highContrastOn}
            onChange={actions.toggleHighContrastOn}
          />
          <label htmlFor="high-contrast-toggle"><i className="ui low vision icon" /> High Contrast</label>
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
