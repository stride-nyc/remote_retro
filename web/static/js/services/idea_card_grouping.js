export default {
  findConnectedGroups: cardRefs => {
    const cardIds = Object.keys(cardRefs).map(Number)

    const groupsMap = {}
    cardIds.forEach(id => {
      groupsMap[id] = new Set([id])
    })

    const rects = batchGetBoundingClientRects(cardRefs)

    cardIds.forEach(id => {
      const overlappingIds = findOverlappingElements(id, rects)
      overlappingIds.forEach(overlappingId => mergeGroups(groupsMap, id, overlappingId))
    })

    const processedGroups = new Set()
    const validGroups = []

    cardIds.forEach(id => {
      const group = groupsMap[id]

      if (group.size <= 1 || processedGroups.has(group)) return

      validGroups.push({
        groupId: id,
        cardIds: Array.from(group),
      })

      processedGroups.add(group)
    })

    return validGroups
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

const batchGetBoundingClientRects = cardRefs => {
  const rects = {}

  Object.entries(cardRefs).forEach(([id, ref]) => {
    if (ref) {
      rects[Number(id)] = ref.getBoundingClientRect()
    }
  })

  return rects
}

const findOverlappingElements = (activeId, rects) => {
  const overlappingIds = []
  const activeRect = rects[activeId]

  if (!activeRect) return overlappingIds

  Object.entries(rects).forEach(([id, rect]) => {
    if (id === activeId || !rect) return

    if (areElementsOverlapping(activeRect, rect)) {
      overlappingIds.push(Number(id))
    }
  })

  return overlappingIds
}

const mergeGroups = (groupsMap, id1, id2) => {
  const group1 = groupsMap[id1]
  const group2 = groupsMap[id2]

  if (group1 === group2) return

  const mergedGroup = new Set([...group1, ...group2])
  mergedGroup.forEach(memberId => {
    groupsMap[memberId] = mergedGroup
  })
}
