import sortBy from "lodash/sortBy"
import SeparatingAxisTheorum from "sat"

export default {
  identifyAllIdeaCollisionsSortedByIdAscending: ideas => {
    let collisions = new Map()

    const ideasSortedByIdAscending = sortBy(ideas, "id")

    ideasSortedByIdAscending.forEach((idea, index) => {
      const ideaBox1 = _buildIdeaBoxWithIdentifier(idea)

      const subset = ideasSortedByIdAscending.slice(index + 1)
      subset.forEach(innerIdea => {
        const ideaBox2 = _buildIdeaBoxWithIdentifier(innerIdea)
        const ideasCollide = SeparatingAxisTheorum.testPolygonPolygon(ideaBox1, ideaBox2)

        if (ideasCollide) {
          collisions = _registerCollisionUniquely(collisions, ideaBox1.id, ideaBox2.id)
        }
      })
    })

    return collisions
  },

  merge: collisions => {
    const collisionKeysInDescendingOrder = Array.from(collisions.keys()).reverse()

    // given a Map where the IDs ascend, we reparent from the back of the Map,
    // as this A) guarantees we group thoroughly without mutating the map in
    // a way that would affect collision detections in subsequent iterations, and B)
    // gives us a performance boost, as it allows us to safely parse down the collisions
    // map as we go, and short-circuit evaluations that have already occurred
    collisionKeysInDescendingOrder.forEach(collisionKey => {
      for (const [key, collisionSet] of collisions) {
        const setToPotentiallyReparent = collisions.get(collisionKey)

        const canSkipComparison = _canSkipComparison(setToPotentiallyReparent, key, collisionKey)

        if (canSkipComparison) { return }

        const intersectionFound = _representsIntersection(collisionSet, setToPotentiallyReparent)

        if (intersectionFound) {
          const allCollisionsCombined = new Set([...collisionSet, ...setToPotentiallyReparent])
          collisions.set(key, allCollisionsCombined)
          collisions.delete(collisionKey)
        }
      }
    })

    return collisions
  },
}

const _registerCollisionUniquely = (collisions, firstId, secondId) => {
  let collisionSetForFirstIdea = _getExistingCollisions(collisions, firstId)

  collisionSetForFirstIdea = new Set([...collisionSetForFirstIdea, firstId, secondId])

  collisions.set(firstId, collisionSetForFirstIdea)

  return collisions
}

const _getExistingCollisions = (collisionsMap, key) => {
  return collisionsMap.get(key) || new Set()
}

export const COLLISION_BUFFER = 3
const _buildIdeaBoxWithIdentifier = ({ id, x, y, height, width }) => {
  const { Box, Vector } = SeparatingAxisTheorum
  const ideaBox = new Box(
    new Vector(x, y), width + COLLISION_BUFFER, height + COLLISION_BUFFER
  ).toPolygon()

  ideaBox.id = id

  return ideaBox
}

const _canSkipComparison = (setToPotentiallyReparent, key, comparisonKey) => {
  const keyRemovedDuringIteration = !setToPotentiallyReparent

  return (keyRemovedDuringIteration || key === comparisonKey)
}

const _buildIntersectionSet = (setA, setB) => {
  return new Set([...setA].filter(x => setB.has(x)))
}

const _representsIntersection = (setA, setB) => {
  return !!_buildIntersectionSet(setA, setB).size
}
