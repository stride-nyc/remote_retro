export default {
  findConnectedGroups: cardRefs => {
    const cardIds = Object.keys(cardRefs).map(Number)
    const groupsMap = {}

    cardIds.forEach(id => {
      groupsMap[id] = new Set([id])
    })

    const mergeGroups = (id1, id2) => {
      const group1 = groupsMap[id1]
      const group2 = groupsMap[id2]

      if (group1 === group2) return

      const mergedGroup = new Set([...group1, ...group2])
      mergedGroup.forEach(memberId => {
        groupsMap[memberId] = mergedGroup
      })
    }

    cardIds.forEach(id => {
      const overlappingIds = findOverlappingElements(id, cardRefs)
      overlappingIds.forEach(overlappingId => mergeGroups(id, overlappingId))
    })

    const groups = []
    const groupSets = new Set()

    cardIds.forEach(id => {
      const group = groupsMap[id]

      if (group.size <= 1 || groupSets.has(group)) return

      groups.push({
        groupId: id,
        cardIds: Array.from(group),
      })

      groupSets.add(group)
    })

    return groups
  },
}

const areElementsOverlapping = (rect1, rect2) => {
  return (
    rect1.right > rect2.left
    && rect1.left < rect2.right
    && rect1.bottom > rect2.top
    && rect1.top < rect2.bottom
  )
}

const findOverlappingElements = (activeId, cardRefs) => {
  const overlappingIds = []
  const activeRect = cardRefs[activeId]?.getBoundingClientRect()

  if (!activeRect) return overlappingIds

  Object.entries(cardRefs).forEach(([id, ref]) => {
    if (id === activeId || !ref) return

    const rect = ref.getBoundingClientRect()
    if (areElementsOverlapping(activeRect, rect)) {
      overlappingIds.push(id)
    }
  })

  return overlappingIds
}
