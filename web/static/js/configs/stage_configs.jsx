import React from "react"

export default {
  "prime-directive": {
    alert: null,
    confirmationMessage: "Has your entire party arrived?",
    nextStage: "idea-generation",
    progressionButton: {
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
    },
  },
  "idea-generation": {
    alert: null,
    confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
    nextStage: "action-items",
    progressionButton: {
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
    },
  },
  "action-items": {
    alert: null,
    confirmationMessage: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
    nextStage: "action-item-distribution",
    progressionButton: {
      copy: "Send Action Items",
      iconClass: "send",
    },
  },
  "action-item-distribution": {
    alert: {
      headerText: "Action Items Distributed",
      bodyText: <div>
        <p>The facilitator has distributed this retro's action items.
          You will receive an email breakdown shortly!</p>
        <p>Also, please please please(!) <a href="https://www.surveymonkey.com/r/JKT9FXM" target="_blank" rel="noopener noreferrer">click here</a> to give us feedback on your experience.</p>
      </div>,
    },
    confirmationMessage: null,
    nextStage: null,
    progressionButton: null,
  },
}
