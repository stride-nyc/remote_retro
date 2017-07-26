import React from "react"

import UserList from "./user_list"
import IdeaBoard from "./idea_board"
import IdeaGenerationLowerThird from "./idea_generation_lower_third"
import DoorChime from "./door_chime"

const IdeaGenerationStage = props => (
  <div style={{ minHeight: "100vh" }}>
    <IdeaBoard {...props} />
    <UserList {...props} />
    <IdeaGenerationLowerThird {...props} />
    <DoorChime {...props} />
  </div>
)

export default IdeaGenerationStage
