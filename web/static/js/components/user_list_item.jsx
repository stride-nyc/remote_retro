import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"

function UserListItem(props) {
  let userName = props.user.given_name
  if (props.user.facilitator) userName += " (Facilitator)"
  return (
    <li className={`item ${styles.wrapper}`}>
      <div className="ui center aligned grid">
        <div className="ui row">{ userName }</div>
        <i className="huge user icon" />
      </div>
    </li>
  )
}

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired
}

export default UserListItem
