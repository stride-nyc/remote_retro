import FacilitationTransferInfo from "../components/facilitation_transfer_info"

const types = {
  CLEAR_ALERT: "CLEAR_ALERT",
  CHANGE_FACILITATOR: "CHANGE_FACILITATOR",
}

export const actions = {
  clearAlert: () => ({ type: types.CLEAR_ALERT }),
  changeFacilitator: previousFacilitatorName => ({
    type: types.CHANGE_FACILITATOR,
    previousFacilitatorName,
  }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case types.CHANGE_FACILITATOR: {
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
    case types.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
