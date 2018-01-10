import React from "react"
import UserListItem from "./user_list_item"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list.css"

const UserList = props => {
  const presencesSortedByArrival = props.presences.sort((a, b) => a.online_at - b.online_at)

  const listItems = presencesSortedByArrival.map(presence =>
    <UserListItem key={presence.token} user={presence} />
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
  presences: AppPropTypes.presences.isRequired,
}

export default UserList
