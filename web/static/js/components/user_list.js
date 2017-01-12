import React, { Component } from 'react'

class UserList extends Component {
  render(){
    const users = this.props.users
    return (
      <section>
        <p>Online:</p>
        <ul className="user-list">
          { users.map(user => <li key={user}>{user}</li>) }
        </ul>
      </section>
    )
  }
}

export default UserList
