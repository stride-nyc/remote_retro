import sortBy from "lodash/sortBy"
import keyBy from "lodash/keyBy"
import cloneDeep from "lodash/cloneDeep"
import SeparatingAxisTheorum from "sat"
import Collisions from "./collisions"

export default {
  buildFrom: ideas => {
    let collisions = new Map()

    const ideasById = cloneDeep(keyBy(ideas, "id"))
    const ideasSortedById = sortBy(ideas, "id")

    ideasSortedById.forEach((idea, index) => {
      if (Number.isFinite(idea.height)) {
        const ideaBox1 = _buildIdeaBoxWithIdentifier(idea)

        const subset = ideasSortedById.slice(index + 1)
        subset.forEach(innerIdea => {
          const ideaBox2 = _buildIdeaBoxWithIdentifier(innerIdea)
          const response = new SeparatingAxisTheorum.Response()
          const collided = SeparatingAxisTheorum.testPolygonPolygon(ideaBox1, ideaBox2, response)

          if (collided) {
            collisions = _registerCollisionUniquely(collisions, ideaBox1.id, ideaBox2.id)
          }
        })
      }
    })

    const collisionsDeduped = Collisions.merge(collisions)

    for (const [ideaId, collisionsForIdea] of collisionsDeduped) {
      ideasById[ideaId].ephemeralGroupingId = ideaId

      collisionsForIdea.forEach(relatedIdeaId => {
        ideasById[relatedIdeaId].ephemeralGroupingId = ideaId
      })
    }

    return Object.values(ideasById)
  },
}

const _registerCollisionUniquely = (collisions, firstId, secondId) => {
  const collisionsForFirstIdea = _getExistingCollisions(collisions, firstId)

  collisionsForFirstIdea.add(secondId)

  collisions.set(firstId, collisionsForFirstIdea)

  return collisions
}

const _getExistingCollisions = (collisionsMap, key) => {
  return collisionsMap.get(key) || new Set()
}

const _buildIdeaBoxWithIdentifier = ({ id, x, y, height, width }) => {
  const { Box, Vector } = SeparatingAxisTheorum
  const ideaBox = new Box(new Vector(x, y), width, height).toPolygon()

  ideaBox.id = id

  return ideaBox
}
