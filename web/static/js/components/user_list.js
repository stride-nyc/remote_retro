import React from "react"
import sortBy from "lodash/sortBy"

function UserList(props) {
  const usersSortedByArrival = sortBy(props.users, "online_at")

  return (
    <section>
      <p>Online:</p>
      <ul id="user-list">
        { usersSortedByArrival.map(user => <li key={user.name}>{user.name}</li>) }
      </ul>
    </section>
  )
}

UserList.propTypes = {
  users: React.PropTypes.array.isRequired
}

export default UserList
