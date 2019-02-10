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
    const { children, wrapperClassName, dragAndDropHandlersActive } = props

    const className = classNames(wrapperClassName, {
      "dragged-over": state.draggedOver,
    })

    const dragAndDropHandlers = dragAndDropHandlersActive ? {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    } : {}

    return (
      <div
        className={className}
        {...dragAndDropHandlers}
      >
        {children}
        <span className="overlay" />
      </div>
    )
  }
}

IdeaDropTarget.propTypes = {
  onDropOfIdea: PropTypes.func.isRequired,
  dragAndDropHandlersActive: PropTypes.bool,
  wrapperClassName: PropTypes.string,
}

IdeaDropTarget.defaultProps = {
  dragAndDropHandlersActive: true,
  wrapperClassName: "",
}

export default IdeaDropTarget
