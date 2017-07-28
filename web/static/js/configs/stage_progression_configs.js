export default {
  "prime-directive": {
    confirmationMessage: "Are you sure want to proceed to the Idea Generation stage? This will commence the retro in earnest.",
    nextStage: "idea-generation",
    button: {
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
    },
  },
  "idea-generation": {
    confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
    nextStage: "action-items",
    button: {
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
    },
  },
  "action-items": {
    confirmationMessage: null,
    nextStage: "action-item-distribution",
    button: {
      copy: "Send Action Items",
      iconClass: "send",
    },
  },
}
