import LobbyStage from "../components/lobby_stage"
import PrimeDirectiveStage from "../components/prime_directive_stage"
import GroupingStage from "../components/grouping_stage"
import GroupsContainer from "../components/groups_container"
import IdeationInterface from "../components/ideation_interface"
import StageChangeInfoPrimeDirective from "../components/stage_change_info_prime_directive"
import StageChangeInfoVoting from "../components/stage_change_info_voting"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoClosed from "../components/stage_change_info_closed"
import StageChangeInfoActionItems from "../components/stage_change_info_action_items"
import IdeasWithEphemeralGroupingIds from "../services/ideas_with_ephemeral_grouping_ids"

import { selectors } from "../redux/votes"

import STAGES from "./stages"

const {
  LOBBY,
  PRIME_DIRECTIVE,
  IDEA_GENERATION,
  GROUPING,
  VOTING,
  LABELING_PLUS_VOTING,
  ACTION_ITEMS,
  GROUPS_ACTION_ITEMS,
  CLOSED,
  GROUPS_CLOSED,
} = STAGES

const baseVotingConfig = {
  arrivalAlert: {
    headerText: "Stage Change: Voting!",
    BodyComponent: StageChangeInfoVoting,
  },
  help: {
    headerText: "Voting!",
    BodyComponent: StageChangeInfoVoting,
  },
  uiComponent: IdeationInterface,
  progressionButton: {
    nextStage: ACTION_ITEMS,
    copy: "Action Items",
    iconClass: "arrow right",
    confirmationMessage: "Wait! Is everyone satisfied with their votes?",
    stateDependentTooltip: selectors.votingStageProgressionTooltip,
  },
}

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
      copy: "Idea Generation",
      iconClass: "arrow right",
      confirmationMessage: "Is everyone ready to begin?",
    },
  },
  [GROUPING]: {
    arrivalAlert: {
      headerText: "Stage Change: Grouping!",
      BodyComponent: StageChangeInfoGrouping,
    },
    help: {
      headerText: "Grouping",
      BodyComponent: StageChangeInfoGrouping,
    },
    uiComponent: GroupingStage,
    progressionButton: {
      nextStage: LABELING_PLUS_VOTING,
      optionalParamsAugmenter: reduxState => ({
        ideasWithEphemeralGroupingIds: IdeasWithEphemeralGroupingIds.buildFrom(reduxState.ideas),
      }),
      copy: "Labeling + Voting",
      iconClass: "arrow right",
      confirmationMessage: "Has your team finished grouping the ideas?",
    },
  },
  [VOTING]: baseVotingConfig,
  [LABELING_PLUS_VOTING]: {
    ...baseVotingConfig,
    progressionButton: {
      ...baseVotingConfig.progressionButton,
      nextStage: GROUPS_ACTION_ITEMS,
    },
    arrivalAlert: {
      headerText: "Stage Change: Labeling + Voting!",
      BodyComponent: StageChangeInfoVoting,
    },
    help: {
      headerText: "Labeling + Voting!",
      BodyComponent: StageChangeInfoVoting,
    },
    uiComponent: GroupsContainer,
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
  [GROUPS_ACTION_ITEMS]: {
    arrivalAlert: {
      headerText: "Stage Change: Action-Item Generation!",
      BodyComponent: StageChangeInfoActionItems,
    },
    help: {
      headerText: "Action-Item Generation",
      BodyComponent: StageChangeInfoActionItems,
    },
    uiComponent: GroupsContainer,
    progressionButton: {
      nextStage: GROUPS_CLOSED,
      copy: "Send Action Items",
      iconClass: "send",
      confirmationMessage: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
    },
  },
  [CLOSED]: {
    arrivalAlert: {
      headerText: "The Retrospective Has Been Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    help: {
      headerText: "This Retrospective Is Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    uiComponent: IdeationInterface,
    progressionButton: null,
  },
  [GROUPS_CLOSED]: {
    arrivalAlert: {
      headerText: "Retro: Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    help: {
      headerText: "Retro is Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    uiComponent: GroupsContainer,
    progressionButton: null,
  },
}
