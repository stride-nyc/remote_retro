import React, { Component } from "react"
import PropTypes from "prop-types"

export const DomElementUtils = {
  isOverflowedY: ({ clientHeight, scrollHeight }) => {
    return scrollHeight > clientHeight
  },
}

export default class OverflowDetector extends Component {
  state = {
    isOverflowed: false,
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const { onOverflowChange } = this.props
      const { isOverflowed: wasOverflowed } = this.state

      const isOverflowed = DomElementUtils.isOverflowedY(this.wrappingEl)

      if (isOverflowed !== wasOverflowed) {
        this.setState({ isOverflowed })
        onOverflowChange(isOverflowed)
      }
    }, 300)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { elementType, children, className } = this.props

    const WrappingEl = elementType

    return (
      <WrappingEl
        className={className}
        ref={wrappingEl => { this.wrappingEl = wrappingEl }}
      >
        {children}
      </WrappingEl>
    )
  }
}

OverflowDetector.propTypes = {
  elementType: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onOverflowChange: PropTypes.func.isRequired,
}

OverflowDetector.defaultProps = {
  className: "",
}
