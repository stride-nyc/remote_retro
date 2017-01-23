import React, { Component } from 'react'
import sortBy from 'lodash/sortBy'

class UserList extends Component {
  render(){
    const usersSortedByArrival = sortBy(this.props.users, 'online_at')

    return (
      <section>
        <p>Online:</p>
        <ul className="user-list">
          { usersSortedByArrival.map(user => <li key={user.name}>{user.name}</li>) }
        </ul>
      </section>
    )
  }
}

export default UserList
