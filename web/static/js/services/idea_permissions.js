export default {
  canUserEditContents: (idea, currentUser) => {
    return idea.user_id === currentUser.id || currentUser.is_facilitator
  },
}
