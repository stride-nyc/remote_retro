import React from "react"

export default () => (
  <React.Fragment>
    The skinny on {localStorage.getItem("groupingDev") && "Labeling +"} Voting:
    <div className="ui basic segment">
      <ul className="ui list">
        {localStorage.getItem("groupingDev")
          && <li>Work as a team to arrive at a sensible label for each group (optional)</li>
        }
        <li>Apply votes to the items you feel are <strong>most important</strong> to discuss.</li>
        <li>You can apply <strong>multiple</strong> votes to a single idea.</li>
        <li>
          Voting is <strong>blind</strong>.
          Totals will be revealed when the facilitator advances the retro.
        </li>
      </ul>
    </div>
  </React.Fragment>
)
