export default {
  // MOSTLY WORKING - need to break this down by group into different ephemeralGroupingIds
  buildFrom: ideas => {
    // Group ideas by temp_group_id
    const groupedIdeas = {}

    // First pass: create groups based on temp_group_id
    ideas.forEach(idea => {
      const tempGroupId = idea.temp_group_id

      // Skip null or undefined temp_group_id
      if (tempGroupId == null) return

      // Initialize group if it doesn't exist
      if (!groupedIdeas[tempGroupId]) {
        groupedIdeas[tempGroupId] = {
          ephemeralGroupingId: tempGroupId,
          ideas: [],
        }
      }

      // Add idea to its group
      groupedIdeas[tempGroupId].ideas.push(idea)
    })

    // Second pass: assign ephemeralGroupingId to each idea
    return ideas.map(idea => {
      // If idea has a temp_group_id and that group exists
      if (idea.temp_group_id != null && groupedIdeas[idea.temp_group_id]) {
        return {
          ...idea,
          ephemeralGroupingId: groupedIdeas[idea.temp_group_id].ephemeralGroupingId,
        }
      }

      // Ideas without a temp_group_id don't get an ephemeralGroupingId
      return { ...idea }
    })
  },
}
