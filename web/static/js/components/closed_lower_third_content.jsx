import React from "react"

import styles from "./css_modules/closed_lower_third_content.css"

const ClosedLowerThirdContent = () => (
  <div className="ui stackable grid basic attached secondary center aligned segment">
    <div className="ui four wide column header">
      <div className="content">
        This retro is all wrapped up!
        <p className="sub header">Contents are read-only.</p>
      </div>
    </div>
    <a href="/retros" className={styles.dashboardLink}>
      <button type="submit" className="ui right labeled gray icon button">
        Visit your dashboard
        <i className="arrow right icon" />
      </button>
    </a>
  </div>
)

export default ClosedLowerThirdContent
