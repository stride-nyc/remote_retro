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
      <img className={styles.picture} src={imgSrc} alt={givenName} />
      <p>{givenName}</p>
      <AnimatedEllipsis display={user.is_typing} />
    </li>
  )
}

UserListItem.propTypes = {
  user: AppPropTypes.user.isRequired,
}

export default UserListItem
