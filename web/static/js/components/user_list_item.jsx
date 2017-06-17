import React from "react"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list_item.css"
import AnimatedEllipsis from "./animated_ellipsis"

const UserListItem = ({ user }) => {
  let givenName = user.given_name
  const imgSrc = user.picture.replace("sz=50", "sz=200")

  if (user.is_facilitator) givenName += " (Facilitator)"
  return (
    <li className={`item ${styles.wrapper}`}>
      <div className="ui center aligned grid">
        <img className={styles.picture} src={imgSrc} alt={givenName} />
        <div className="ui row">
          <p className={styles.name}>{ givenName }</p>
          <p className={`${styles.animatedEllipsisWrapper} ui row`}>
            { user.is_typing && <AnimatedEllipsis /> }
          </p>
        </div>
      </div>
    </li>
  )
}

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired,
}

export default UserListItem
