import React, { Component } from "react"

class StageProgressionButton extends Component {
  constructor(props) {
    super(props)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }

  handleToggleChange() {
    this.props.onToggleActionItem()
  }

  render() {
    return (
      <div className="ui toggle checkbox">
        <input type="checkbox" onChange={this.handleToggleChange} id="action-item-toggle" />
        <label htmlFor="action-item-toggle">Toggle Action Items</label>
      </div>
    )
  }
}

StageProgressionButton.propTypes = {
  onToggleActionItem: React.PropTypes.func.isRequired,
}

export default StageProgressionButton
