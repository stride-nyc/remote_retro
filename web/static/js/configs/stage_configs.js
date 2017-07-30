export default {
  "prime-directive": {
    alertConfig: null,
    confirmationMessage: "Are you sure want to proceed to the Idea Generation stage? This will commence the retro in earnest.",
    nextStage: "idea-generation",
    button: {
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
    },
  },
  "idea-generation": {
    alertConfig: null,
    confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
    nextStage: "action-items",
    button: {
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
    },
  },
  "action-items": {
    alertConfig: null,
    confirmationMessage: null,
    nextStage: "action-item-distribution",
    button: {
      copy: "Send Action Items",
      iconClass: "send",
    },
  },
  "action-item-distribution": {
    alertConfig: {
      headerText: "Retro Closed!",
      bodyText: "The facilitator has closed this retrospective. You will receive an email containing the retrospective's action items shortly.",
    },
  },
}
