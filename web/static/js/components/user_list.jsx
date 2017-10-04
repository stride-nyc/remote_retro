import React from "react"
import UserListItem from "./user_list_item"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list.css"

const UserList = props => {
  const usersSortedByArrival = props.users.sort((a, b) => a.online_at - b.online_at)

  const listItems = usersSortedByArrival.map(user =>
    <UserListItem key={user.online_at} user={user} />
  )

  return (
    <section className={`${styles.index} ui center aligned basic segment`}>
      <ul id="user-list" className="ui horizontal list">
        {listItems}
      </ul>
    </section>
  )
}

UserList.propTypes = {
  users: AppPropTypes.users.isRequired,
}

export default UserList
