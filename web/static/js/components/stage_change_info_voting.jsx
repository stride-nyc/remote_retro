import React from "react"

export default () => (
  <React.Fragment>
    The skinny on Voting:
    <div className="ui basic segment">
      <ul className="ui list">
        <li>You have <strong>3</strong> votes.</li>
        <li>You can apply <strong>multiple</strong> votes to a single idea.</li>
        <li>
          Voting is <strong>blind</strong>.
          Totals will be revealed when the facilitator advances the retro.
        </li>
      </ul>
    </div>
  </React.Fragment>
)
