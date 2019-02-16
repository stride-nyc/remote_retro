import React from "react"

export default () => (
  <React.Fragment>
    The skinny on voting:
    <div className="ui basic segment">
      <ul className="ui list">
        <li>You have <strong>3</strong> votes.</li>
        <li>You can apply <strong>multiple</strong> votes to a single idea.</li>
        <li>
          Voting is <strong>blind</strong>.
          Totals will be revealed when the facilitator advances the retro.
        </li>
        { !localStorage.subtractVoteDev
          && <li>Once a vote has been cast, there's no taking it back, so vote carefully!</li>
        }
      </ul>
    </div>
  </React.Fragment>
)
