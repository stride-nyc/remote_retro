import React from "react"
import cx from "classnames"

import ContactUs from "../services/contact_us"
import * as AppPropTypes from "../prop_types"

import styles from "./css_modules/contact_stride_cta.css"

const ContactStrideCTA = ({ alert, currentUser }) => {
  const wrapperClasses = cx(styles.wrapper, {
    active: !alert,
  })

  const prepopulatedContactUsHref = ContactUs.buildPrepulatedFormForUser(currentUser)

  return (
    <section className={wrapperClasses}>
      <img src={`${ASSET_DOMAIN}/images/stride_logo.png`} alt="" />
      <h3 className="ui header">
        This retrospective was brought to you by Stride Consulting.
      </h3>

      <div className={styles.ctaSection}>
        <p className="ui small header">Issues with software delivery?</p>
        <a
          className="ui green button"
          href={prepopulatedContactUsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Let's talk.
        </a>
      </div>
    </section>
  )
}

ContactStrideCTA.propTypes = {
  alert: AppPropTypes.alert,
  currentUser: AppPropTypes.user.isRequired,
}

ContactStrideCTA.defaultProps = {
  alert: null,
}

export default ContactStrideCTA
