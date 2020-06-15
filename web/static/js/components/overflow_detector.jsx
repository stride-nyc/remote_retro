import React, { Component } from "react"
import PropTypes from "prop-types"

export const DomElementUtils = {
  isOverflowedY: ({ clientHeight, scrollHeight }) => {
    return scrollHeight > clientHeight
  },
}

export default class OverflowDetector extends Component {
  constructor(props) {
    super(props)
    this.isOverflowed = false
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const {
        isOverflowed: wasOverflowed,
        props,
        wrappingEl,
      } = this

      const isOverflowed = DomElementUtils.isOverflowedY(wrappingEl)

      if (isOverflowed !== wasOverflowed) {
        this.isOverflowed = isOverflowed
        props.onOverflowChange(isOverflowed)
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
