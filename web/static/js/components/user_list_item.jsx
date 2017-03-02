import React from "react"

import styles from "./css_modules/user_list_item.css"

function UserListItem(props) {
  let userName = props.user.name
  if (props.facilitator) userName += "(Facilitator)"
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
  user: React.PropTypes.shape({
    name: React.PropTypes.string,
    online_at: React.PropTypes.number,
  }).isRequired,
}

export default UserListItem
