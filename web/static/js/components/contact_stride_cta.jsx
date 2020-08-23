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

      <p>Got software problems?</p>

      <button className="ui tiny green button">Email Debbie!</button>
    </section>
  )
}

export default ContactStrideCTA
