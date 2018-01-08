import React from "react"

import styles from "./css_modules/centered_text.css"

const PrimeDirective = () => (
  <div className={styles.centeredText}>
    <h1 className="ui dividing header">The Prime Directive:</h1>
    <p>
      Regardless of what we discover,<br />
      we understand and truly believe<br />
      that everyone did the best job they could,<br />
      given what they knew at the time,<br />
      their skills and abilities,<br />
      the resources available, and the situation at hand.
    </p>
  </div>
)

export default PrimeDirective
