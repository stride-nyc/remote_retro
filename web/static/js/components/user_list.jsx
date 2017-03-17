import React from "react"
import UserListItem from "./user_list_item"
import * as AppPropTypes from "../prop_types"

function UserList(props) {
  const usersSortedByArrival = props.users.sort((userOne, userTwo) => {
    return userOne.online_at > userTwo.online_at
  })

  const listItems = usersSortedByArrival.map(user =>
    <UserListItem key={user.online_at} user={user} />,
  )

  return (
    <section className="ui center aligned basic segment">
      <ul id="user-list" className="ui horizontal list">
        {listItems}
      </ul>
    </section>
  )
}

UserList.propTypes = {
  users: AppPropTypes.users.isRequired
}

export default UserList
