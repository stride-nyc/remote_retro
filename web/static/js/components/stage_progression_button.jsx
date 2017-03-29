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
      <button
        id="action-item-toggle"
        className="ui right labeled teal icon button"
        onClick={this.handleToggleChange}
      >
        Proceed to Action Items
        <i className="arrow right icon"></i>
      </button>
    )
  }
}

StageProgressionButton.propTypes = {
  onToggleActionItem: React.PropTypes.func.isRequired,
}

export default StageProgressionButton
