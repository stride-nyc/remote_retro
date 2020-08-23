import React from "react"
import cx from "classnames"

import styles from "./css_modules/contact_stride_cta.css"

const ContactStrideCTA = ({ alert }) => {
  const wrapperClasses = cx(styles.wrapper, {
    active: !alert,
  })

  return (
    <section className={wrapperClasses}>
      <img src="/images/stride_logo.png" alt="" />
      <h3 className="ui header">
        This retrospective was brought to you by Stride Consulting.
      </h3>

      <div className={styles.ctaSection}>
        <p className="ui small header">Issues with software delivery?</p>
        <a className="ui green button">Let's talk.</a>
      </div>
    </section>
  )
}

export default ContactStrideCTA
