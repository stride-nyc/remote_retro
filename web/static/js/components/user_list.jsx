import React from "react"
import { connect } from "react-redux"

import UserListItem from "./user_list_item"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/user_list.css"

export const UserList = ({ presences, facilitatorId }) => {
  if (presences.length === 0) { return null }

  const sortedByArrival = presences.sort((a, b) => a.online_at - b.online_at)
  const indexOfFacilitator = sortedByArrival.findIndex(presence => presence.id === facilitatorId)

  const nonFacilitators = [
    ...sortedByArrival.slice(0, indexOfFacilitator),
    ...sortedByArrival.slice(indexOfFacilitator + 1),
  ]

  // account for cases where the facilitator isn't present
  // (comp falls asleep, browser refresh, et cetera)
  const presencesToRender = indexOfFacilitator === -1 ?
    sortedByArrival :
    [presences[indexOfFacilitator], ...nonFacilitators]

  const listItems = presencesToRender.map(presence =>
    <UserListItem key={presence.token} user={presence} facilitatorId={facilitatorId} />
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
  facilitatorId: AppPropTypes.facilitatorId.isRequired,
}

const mapStateToProps = ({ facilitatorId }) => ({ facilitatorId })

export default connect(mapStateToProps)(UserList)
