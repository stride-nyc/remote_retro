import React, { Component } from "react"

import UserList from "./user_list"

class Retro extends Component {
  render() {
    return <UserList users={ this.props.users }/>
  }
}

export default Retro
