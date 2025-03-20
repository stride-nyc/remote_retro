export default {
  buildFrom: ideas => {
    return ideas.map(idea => {
      if (idea.temp_group_id != null) {
        return { ...idea, ephemeralGroupingId: idea.temp_group_id }
      }

      return { ...idea }
    })
  },
}
