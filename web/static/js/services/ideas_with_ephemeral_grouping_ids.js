import Collisions from "./collisions"

export default {
  buildFrom: ideas => {
    const collisions = Collisions.identifyAllIdeaCollisionsSortedByIdAscending(ideas)
    const collisionsDeduped = Collisions.merge(collisions)

    const ideasByIdWithEphemeralGroupingIdCandidate = ideas.reduce((accumulator, idea, index) => {
      accumulator[idea.id] = { ...idea, ephemeralGroupingIdCandidate: index + 1 }
      return accumulator
    }, {})

    for (const [groupLeaderId, collisionsForIdea] of collisionsDeduped) {
      collisionsForIdea.forEach(relatedIdeaId => {
        const groupLeaderIdea = ideasByIdWithEphemeralGroupingIdCandidate[groupLeaderId]
        const relatedIdea = ideasByIdWithEphemeralGroupingIdCandidate[relatedIdeaId]

        relatedIdea.ephemeralGroupingId = groupLeaderIdea.ephemeralGroupingIdCandidate
      })
    }

    return Object.values(ideasByIdWithEphemeralGroupingIdCandidate)
      .map(({ ephemeralGroupingIdCandidate, ...rest }) => rest)
  },
}
