import React, { PropTypes } from "react"

class VoteCounter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      voteNumber: 0,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ voteNumber: this.state.voteNumber += 1 })
  }

  render() {
    const { voteNumber } = this.state

    return (
      <span>
        <div className="ui labeled right floated button">
          <button className="ui green button" onClick={this.handleClick}>
            Vote
          </button>
          <a className="ui basic green left pointing label">
            {voteNumber}
          </a>
        </div>
      </span>
    )
  }
}



export default VoteCounter
