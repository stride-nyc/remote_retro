import React from "react"
import sortBy from "lodash/sortBy"

import UserListItem from "./user_list_item"

function UserList(props) {
  const usersSortedByArrival = sortBy(props.users, "online_at")

  return (
    <section className="ui center aligned basic segment">
      <ul id="user-list" className="ui horizontal list">
        { usersSortedByArrival.map(user => <UserListItem key={ user.name } user={ user }/>) }
      </ul>
    </section>
  )
}

UserList.propTypes = {
  users: React.PropTypes.array.isRequired
}

export default UserList
