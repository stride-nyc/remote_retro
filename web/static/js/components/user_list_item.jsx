import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"

function UserListItem(props) {
  let userName = props.user.given_name
  if (props.user.is_facilitator) userName += " (Facilitator)"
  return (
    <li className={`item ${styles.wrapper}`}>
      <div className="ui center aligned grid">
        {IconTag(props.user)}
        <div className="ui row">
          <p className={styles.name}>{ userName }</p>
          <p className={`${styles.ellipsisAnim} ui row`}>
            { props.user.is_typing &&
              <span>
                <i className="circle icon" />
                <i className="circle icon" />
                <i className="circle icon" />
              </span>
            }
          </p>
        </div>
      </div>
    </li>
  )
}

const IconTag = user => {
  let icon

  if (user.picture) {
    const src = user.picture.replace("sz=50", "sz=200")
    icon = <img className={styles.picture} src={src} alt={user.given_name} />
  } else {
    icon = <i className="huge user icon" />
  }

  return icon
}

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired,
}

export default UserListItem
