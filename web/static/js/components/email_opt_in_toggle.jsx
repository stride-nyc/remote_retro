import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/email_opt_in_toggle.css"

const EmailOptInToggle = props => {
  const { actions, currentUser } = props

  return (
    <div className={`${styles.emailOptInToggle} ui secondary compact segment thirteen wide mobile eight wide tablet four wide computer column`}>
      <p>
        Would you like to receive occasional emails from RemoteRetro
        and Stride Consulting? You can opt out any time, per our <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
      </p>
      <button
        className="ui tiny basic fluid compact button"
        type="button"
        onClick={() => {
          actions.updateUserAsync(currentUser.id, { email_opt_in: !currentUser.email_opt_in })
        }}
      >
        <div className="ui toggle checkbox">
          <label htmlFor="email-opt-in">
            <input 
              type="checkbox" 
              name="public" 
              id="email-opt-in"
              checked={currentUser.email_opt_in} 
              readOnly 
            />
            Sign me up!
          </label>
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
