import LobbyStage from "../components/lobby_stage"
import PrimeDirectiveStage from "../components/prime_directive_stage"
import GroupingStage from "../components/grouping_stage"
import GroupsContainer from "../components/groups_container"
import IdeationInterface from "../components/ideation_interface"
import StageChangeInfoPrimeDirective from "../components/stage_change_info_prime_directive"
import StageChangeInfoVoting from "../components/stage_change_info_voting"
import StageChangeInfoGrouping from "../components/stage_change_info_grouping"
import StageChangeInfoGroupsLabeling from "../components/stage_change_info_groups_labeling"
import StageChangeInfoGroupsVoting from "../components/stage_change_info_groups_voting"
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
  ACTION_ITEMS,
  GROUPS_LABELING,
  GROUPS_VOTING,
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
    confirmationMessageHTML: "<strong>WAIT!</strong> Is everyone satisfied with their votes?",
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
      confirmationMessageHTML: "Has your entire party arrived?",
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
      confirmationMessageHTML: "Is everyone ready to begin?",
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
      nextStage: GROUPS_LABELING,
      optionalParamsAugmenter: reduxState => ({
        ideasWithEphemeralGroupingIds: IdeasWithEphemeralGroupingIds.buildFrom(reduxState.ideas),
      }),
      copy: "Group Labeling",
      iconClass: "arrow right",
      confirmationMessageHTML: "Has your team finished grouping the ideas?",
    },
  },
  [GROUPS_LABELING]: {
    arrivalAlert: {
      headerText: "Stage Change: Labeling!",
      BodyComponent: StageChangeInfoGroupsLabeling,
    },
    help: {
      headerText: "Labeling",
      BodyComponent: StageChangeInfoGroupsLabeling,
    },
    uiComponent: GroupsContainer,
    progressionButton: {
      nextStage: GROUPS_VOTING,
      copy: "Voting",
      iconClass: "arrow right",
      confirmationMessageHTML: "Is your team satisfied with the applied labels?",
    },
  },
  [GROUPS_VOTING]: {
    arrivalAlert: {
      headerText: "Stage Change: Voting!",
      BodyComponent: StageChangeInfoGroupsVoting,
    },
    help: {
      headerText: "Voting",
      BodyComponent: StageChangeInfoGroupsVoting,
    },
    uiComponent: GroupsContainer,
    progressionButton: {
      nextStage: GROUPS_ACTION_ITEMS,
      copy: "Action Items",
      iconClass: "arrow right",
      confirmationMessageHTML: "Is your team satisfied with their votes?",
      stateDependentTooltip: selectors.votingStageProgressionTooltip,
    },
  },
  [VOTING]: baseVotingConfig,
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
      confirmationMessageHTML: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
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
      confirmationMessageHTML: "Are you sure you want to distribute this retrospective's action items? This will close the retro.",
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
      headerText: "The Retrospective Has Been Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    help: {
      headerText: "This Retrospective Is Closed!",
      BodyComponent: StageChangeInfoClosed,
    },
    uiComponent: GroupsContainer,
    progressionButton: null,
  },
}
