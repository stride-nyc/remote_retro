import React, { Component } from "react"
import cx from "classnames"
import PropTypes from "prop-types"

class SuccessCheckmark extends Component {
  componentDidMount() {
    const { onMount } = this.props
    onMount()
  }

  render() {
    const { cssModifier } = this.props

    const classes = cx(["ui", "green", "check", "icon", cssModifier])

    return (
      <div>
        <i className={classes} />
      </div>
    )
  }
}

SuccessCheckmark.propTypes = {
  onMount: PropTypes.func.isRequired,
  cssModifier: PropTypes.string,
}

SuccessCheckmark.defaultProps = {
  cssModifier: "",
}

export default SuccessCheckmark
