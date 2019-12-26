import LobbyStage from "../components/lobby_stage"
import PrimeDirectiveStage from "../components/prime_directive_stage"
import GroupingStage from "../components/grouping_stage"
import GroupNamingStage from "../components/group_naming_stage"
import IdeationInterface from "../components/ideation_interface"
import StageChangeInfoPrimeDirective from "../components/stage_change_info_prime_directive"
import StageChangeInfoVoting from "../components/stage_change_info_voting"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoGroupNaming from "../components/stage_change_info_group_naming"
import StageChangeInfoClosed from "../components/stage_change_info_closed"
import StageChangeInfoActionItems from "../components/stage_change_info_action_items"
import IdeasWithEphemeralGroupingIds from "../services/ideas_with_ephemeral_grouping_ids"

import STAGES from "./stages"
import { VOTE_LIMIT } from "./retro_configs"

const {
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  GROUP_NAMING,
  VOTING,
  ACTION_ITEMS,
  CLOSED,
} = STAGES

export default {
  [LOBBY]: {
    arrivalAlert: null,
    help: null,
    uiComponent: LobbyStage,
    progressionButton: {
      nextStage: PRIME_DIRECTIVE,
      copy: "Begin Retro",
      iconClass: "arrow right",
      confirmationMessage: "Has your entire party arrived?",
    },
  },
  [PRIME_DIRECTIVE]: {
    arrivalAlert: {
      headerText: "Stage Change: The Prime Directive!",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    help: {
      headerText: "The Prime Directive",
      BodyComponent: StageChangeInfoPrimeDirective,
    },
    uiComponent: PrimeDirectiveStage,
    progressionButton: {
      nextStage: IDEA_GENERATION,
      copy: "Proceed to Idea Generation",
      iconClass: "arrow right",
      confirmationMessage: "Is everyone ready to begin?",
    },
  },
  [GROUPING]: {
    arrivalAlert: {
      headerText: "Stage Change: Idea Grouping!",
      BodyComponent: StageChangeInfoGrouping,
    },
    help: {
      headerText: "Idea Grouping",
      BodyComponent: StageChangeInfoGrouping,
    },
    uiComponent: GroupingStage,
    progressionButton: {
      nextStage: GROUP_NAMING,
      optionalParamsAugmenter: reduxState => ({
        ideasWithEphemeralGroupingIds: IdeasWithEphemeralGroupingIds.buildFrom(reduxState.ideas),
      }),
      copy: "Proceed to Group Naming",
      iconClass: "arrow right",
      confirmationMessage: "Has your team finished grouping the ideas?",
    },
  },
  [GROUP_NAMING]: {
    arrivalAlert: {
      headerText: "Stage Change: Group Naming!",
      BodyComponent: StageChangeInfoGroupNaming,
    },
    help: {
      headerText: "Group Naming",
      BodyComponent: StageChangeInfoGroupNaming,
    },
    uiComponent: GroupNamingStage,
    progressionButton: {
      nextStage: VOTING,
      copy: "Proceed to Voting",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the voting stage?",
    },
  },
  [VOTING]: {
    arrivalAlert: {
      headerText: "Stage Change: Voting!",
      BodyComponent: StageChangeInfoVoting,
    },
    help: {
      headerText: "Voting",
      BodyComponent: StageChangeInfoVoting,
    },
    uiComponent: IdeationInterface,
    progressionButton: {
      nextStage: ACTION_ITEMS,
      copy: "Proceed to Action Items",
      iconClass: "arrow right",
      confirmationMessage: "Are you sure you would like to proceed to the action items stage?",
      stateDependentTooltip: reduxState => {
        const { votes, presences } = reduxState
        const TOTAL_VOTE_LIMIT_FOR_RETRO = VOTE_LIMIT * presences.length

        if (votes.length >= TOTAL_VOTE_LIMIT_FOR_RETRO) {
          return "All votes in!"
        }
        return null
      },
    },
  },
  [ACTION_ITEMS]: {
    arrivalAlert: {
      headerText: "Stage Change: Action-Item Generation!",
      BodyComponent: StageChangeInfoActionItems,
    },
    help: {
      headerText: "Action-Item Generation",
      BodyComponent: StageChangeInfoActionItems,
    },
    uiComponent: IdeationInterface,
    progressionButton: {
      nextStage: CLOSED,
      copy: "Send Action Items",
      iconClass: "send",
      confirmationMessage: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
    },
  },
  [CLOSED]: {
    arrivalAlert: {
      headerText: "Retro: Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    help: {
      headerText: "Retro is Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    uiComponent: IdeationInterface,
    progressionButton: null,
  },
}
