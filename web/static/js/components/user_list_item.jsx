import React from "react"

function UserListItem(props) {
  return (
    <li className="item">
      <div className="ui center aligned grid">
        <div className="ui row">{ props.user.name }</div>
        <i className="huge user icon" />
      </div>
    </li>
  )
}

UserListItem.propTypes = {
  user: React.PropTypes.shape({
    name: React.PropTypes.string,
  }).isRequired,
}

export default UserListItem
