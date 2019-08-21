import keyBy from "lodash/keyBy"
import cloneDeep from "lodash/cloneDeep"
import Collisions from "./collisions"

export default {
  buildFrom: ideas => {
    const ideaIdsToEphemeralGroupingIdsMap = ideas.reduce((accumulator, idea, index) => {
      accumulator[idea.id] = index + 1
      return accumulator
    }, {})

    const collisions = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
    const collisionsDeduped = Collisions.merge(collisions)

    // return new objects to ensure stale ephemeral grouping ids get flushed
    const ideasById = cloneDeep(keyBy(ideas, "id"))

    for (const [groupLeaderId, collisionsForIdea] of collisionsDeduped) {
      collisionsForIdea.forEach(relatedIdeaId => {
        const ephemeralGroupingId = ideaIdsToEphemeralGroupingIdsMap[groupLeaderId]
        ideasById[relatedIdeaId].ephemeralGroupingId = ephemeralGroupingId
      })
    }

    return Object.values(ideasById)
  },
}
