/* eslint-disable react/no-danger */
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

    <span
      className={styles.githubStarPromptWrapper}
    >
      <div className={styles.displayRelative}>
        <span
          dangerouslySetInnerHTML={{
            __html: "<iframe src='https://ghbtns.com/github-btn.html?user=stride-nyc&amp;repo=remote_retro&amp;type=watch&amp;count=true&size=large' allowtransparency='true' frameborder='0' scrolling='0' width='131px' height='30px'></iframe>",
          }}
        />
        <div className={`ui pointing below blue large label ${styles.callToAction}`}>
          Help us out!
        </div>
      </div>
    </span>
  </div>
)

/* eslint-enable react/no-danger */

export default ClosedLowerThirdContent
