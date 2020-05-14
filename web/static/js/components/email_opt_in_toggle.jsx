import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import styles from "./css_modules/email_opt_in_toggle.css"

const EmailOptInToggle = props => {
  const { actions, emailOptIn } = props

  const wrapperClasses = cx(styles.wrapper)

  return (
    <div className="thirteen wide mobile eight wide tablet four wide computer column">
      <div className={wrapperClasses}>
        <p>
          Would you like to receive occasional emails from RemoteRetro
          and Stride Consulting?
        </p>
        <p>
          You can opt out any time. <a href="/privacy">Privacy Policy</a>
        </p>
        <button className="ui basic compact button" type="button" onClick={actions.toggleEmailOptIn}>
          <div className="ui toggle checkbox">
            <input type="checkbox" name="public" checked={emailOptIn} readOnly />
            <label>Sure! Sign me up.</label>
          </div>
        </button>
      </div>
    </div>
  )
}

EmailOptInToggle.propTypes = {
  actions: PropTypes.object.isRequired,
  emailOptIn: PropTypes.bool.isRequired,
}

export default EmailOptInToggle
