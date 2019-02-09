export default {
  canUserEditContents: (idea, user) => {
    return idea.user_id === user.id || user.is_facilitator
  },
}
