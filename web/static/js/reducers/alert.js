import FacilitationTransferInfo from "../components/facilitation_transfer_info"

const alert = (state = null, action) => {
  switch (action.type) {
    case "CHANGE_FACILITATOR": {
      const { previousFacilitatorName } = action
      return {
        headerText: "Facilitation Transfer!",
        BodyComponent: () => FacilitationTransferInfo(previousFacilitatorName),
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
