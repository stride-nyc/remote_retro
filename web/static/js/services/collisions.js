export default {
  merge: collisions => {
    return _reparentCollisionsUntilThereIsNoReparentingToBeDone(collisions)
  },
}

const _reparentCollisionsUntilThereIsNoReparentingToBeDone = collisions => {
  const collisionKeys = Array.from(collisions.keys()).reverse()

  collisionKeys.forEach(collisionKey => {
    for (const [key, collisionSet] of collisions) {
      const setToPotentiallyReparent = collisions.get(collisionKey)
      const keyRemovedDuringIteration = !setToPotentiallyReparent

      if (keyRemovedDuringIteration || key === collisionKey) { return }

      const intersectionFound = _representsIntersection(
        collisionSet,
        new Set([...setToPotentiallyReparent, collisionKey])
      )

      if (intersectionFound) {
        const allCollisions = new Set([...collisionSet, ...setToPotentiallyReparent, collisionKey])
        collisions.set(key, allCollisions)
        collisions.delete(collisionKey)
      }
    }
  })

  return collisions
}

const _buildIntersectionSet = (setA, setB) => {
  return new Set([...setA].filter(x => setB.has(x)))
}

const _representsIntersection = (setA, setB) => {
  return !!_buildIntersectionSet(setA, setB).size
}
