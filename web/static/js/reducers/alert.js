import React from "react";

const alert = (state = null, action) => {
  switch (action.type) {
    case "CHANGE_FACILITATOR": {
      const { previousFacilitatorName } = action
      return {
        headerText: "Facilitation Transfer!",
        BodyComponent: () => <p>With {previousFacilitatorName}'s departure, you have assumed the role of facilitator. You'll be responsible for advancing the retro!</p>
      }
    }
    case "UPDATE_STAGE": {
      const { stage, stageConfigs } = action
      return stageConfigs[stage].alert
    }
    case "CLEAR_ALERT":
      return null
    default:
      return state
  }
}

export default alert
