import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

require("./css_modules/idea_drop_target.css")

export class IdeaDropTarget extends Component {
  state = {}

  handleDragOver = event => {
    this.setState({ draggedOver: true })
    event.preventDefault()
  }

  handleDragLeave = event => {
    const { currentTarget, relatedTarget } = event
    if (currentTarget.contains(relatedTarget)) { return }

    this.setState({ draggedOver: false })
  }

  handleDrop = event => {
    const ideaData = event.dataTransfer.getData("idea")

    // account for unrelated drops triggered by the browser, such as images
    if (!ideaData) { return }

    this.setState({ draggedOver: false })
    event.preventDefault()

    const idea = JSON.parse(ideaData)

    // allow consumers to decide what to do when idea is dropped
    this.props.onDropOfIdea(idea)
  }

  render() {
    const { handleDragOver, handleDrop, handleDragLeave, props, state } = this
    const { children, wrapperClassName } = props

    const className = classNames(wrapperClassName, {
      "dragged-over": state.draggedOver,
    })

    return (
      <div
        className={className}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children}
        <span className="overlay" />
      </div>
    )
  }
}

IdeaDropTarget.propTypes = {
  onDropOfIdea: PropTypes.func.isRequired,
  wrapperClassName: PropTypes.string,
}

IdeaDropTarget.defaultProps = {
  wrapperClassName: "",
}

export default IdeaDropTarget
