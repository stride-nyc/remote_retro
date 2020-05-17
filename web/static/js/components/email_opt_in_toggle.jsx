import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/email_opt_in_toggle.css"

const EmailOptInToggle = props => {
  const { actions, currentUser } = props

  return (
    <div className="thirteen wide mobile eight wide tablet four wide computer column">
      <div className={styles.wrapper}>
        <p>
          Would you like to receive occasional emails from RemoteRetro
          and Stride Consulting?
        </p>
        <p>
          You can opt out any time. <a href="/privacy">Privacy Policy</a>
        </p>
        <button
          className="ui basic compact button"
          type="button"
          onClick={() => {
            actions.updateUserAsync(currentUser.id, { email_opt_in: !currentUser.email_opt_in })
          }}
        >
          <div className="ui toggle checkbox">
            <input type="checkbox" name="public" checked={currentUser.email_opt_in} readOnly />
            <label>Sure! Sign me up.</label>
          </div>
        </button>
      </div>
    </div>
  )
}

EmailOptInToggle.propTypes = {
  actions: AppPropTypes.actions.isRequired,
  currentUser: AppPropTypes.user.isRequired,
}

export default EmailOptInToggle
