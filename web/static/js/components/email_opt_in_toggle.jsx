import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/email_opt_in_toggle.css"

function EmailOptInToggle(props) {
  const { actions, currentUser } = props

  return (
    <div className={`${styles.emailOptInToggle} ui secondary compact segment thirteen wide mobile eight wide tablet four wide computer column`}>
      <p>
        Would you like to receive occasional emails from RemoteRetro
        and Stride Consulting? You can opt out any time, per our <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
      </p>
      <button className="ui tiny basic fluid compact button" type="button">
        <div className="ui toggle checkbox">
          {/*
            a label with htmlFor forwards a native click to its associated
            control - putting the toggle action on this button too (as a
            shared ancestor) would double-fire it per click, canceling out
            the state change. the checkbox's own onChange is the single
            source of truth instead.
          */}
          <input
            id="email-opt-in"
            type="checkbox"
            name="public"
            checked={currentUser.email_opt_in}
            onChange={() => {
              actions.updateUserAsync(currentUser.id, { email_opt_in: !currentUser.email_opt_in })
            }}
          />
          <label htmlFor="email-opt-in">Sign me up!</label>
        </div>
      </button>
    </div>
  )
}

EmailOptInToggle.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
}

export default EmailOptInToggle
