import React from "react"
import sortBy from "lodash/sortBy"

import UserListItem from "./user_list_item"

function UserList(props) {
  const usersSortedByArrival = sortBy(props.users, "online_at")
  const listItems = usersSortedByArrival.map((user, index) => <UserListItem key={index} user={user} facilitator={index === 0}/>)

  return (
    <section className="ui center aligned basic segment">
      <ul id="user-list" className="ui horizontal list">
        {listItems}
      </ul>
    </section>
  )
}

UserList.propTypes = {
  users: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default UserList
