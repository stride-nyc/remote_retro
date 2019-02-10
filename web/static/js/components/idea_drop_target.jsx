import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import throttle from "lodash/throttle"

require("./css_modules/idea_drop_target.css")

export class IdeaDropTarget extends Component {
  state = {}

  handleDragOver = event => {
    // must always be called to ensure drop events fire
    // https://stackoverflow.com/questions/19133225/is-call-to-preventdefault-really-necessary-on-drop-event
    event.preventDefault()

    // dragOver fires every few ms, even when the mouse *isn't* moving, so we debounce
    this._debouncedUpdateToDraggedOverTrue()
  }

  _debouncedUpdateToDraggedOverTrue = throttle(() => {
    this.setState({ draggedOver: true })
  }, 100)

  _setDraggedOverToFalse = () => {
    // cancel any queued updates triggered by the dragOver handler so that
    // draggedOver doesn't get set to true *after* being set to false
    // https://lodash.com/docs/4.17.11#throttle
    this._debouncedUpdateToDraggedOverTrue.cancel()
    this.setState({ draggedOver: false })
  }

  handleDragLeave = event => {
    const { currentTarget, relatedTarget } = event
    if (currentTarget.contains(relatedTarget)) { return }

    this._setDraggedOverToFalse()
  }

  handleDrop = event => {
    const ideaData = event.dataTransfer.getData("idea")

    // account for unrelated drops triggered by the browser, such as images
    if (!ideaData) { return }

    event.preventDefault()
    this._setDraggedOverToFalse()

    const idea = JSON.parse(ideaData)

    // allow consumers to decide what to do when idea is dropped
    this.props.onDropOfIdea(idea)
  }

  render() {
    const { handleDragOver, handleDrop, handleDragLeave, props, state } = this
    const { tagName, children, wrapperClassName, dragAndDropHandlersActive, title } = props

    const className = classNames(wrapperClassName, {
      "dragged-over": state.draggedOver,
    })

    const dragAndDropHandlers = dragAndDropHandlersActive ? {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    } : {}

    // React requires a Capitalized constant
    const WrappingElement = tagName

    return (
      <WrappingElement
        className={className}
        title={title}
        {...dragAndDropHandlers}
      >
        {children}
        <span className="overlay" />
      </WrappingElement>
    )
  }
}

IdeaDropTarget.propTypes = {
  dragAndDropHandlersActive: PropTypes.bool,
  onDropOfIdea: PropTypes.func.isRequired,
  tagName: PropTypes.string,
  title: PropTypes.string,
  wrapperClassName: PropTypes.string,
}

IdeaDropTarget.defaultProps = {
  dragAndDropHandlersActive: true,
  tagName: "div",
  title: "",
  wrapperClassName: "",
}

export default IdeaDropTarget
