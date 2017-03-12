import React, { Component } from "react"

class ActionItemToggle extends Component {
  constructor(props) {
    super(props)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }

  handleToggleChange() {
    this.props.onToggleActionItem()
  }

  render() {
    return (
        <input type="checkbox" onChange={this.handleToggleChange} id="action-item-toggle" />
        <label htmlFor="action-item-toggle">Toggle Action Items</label>
      </div>
    )
  }
}

ActionItemToggle.propTypes = {
  onToggleActionItem: React.PropTypes.func.isRequired,
}

export default ActionItemToggle
