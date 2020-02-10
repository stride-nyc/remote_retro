import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"

const SuccessCheckmark = ({ cssModifier }) => {
  const classes = cx(["ui", "green", "check", "icon", cssModifier])

  return (
    <div>
      <i className={classes} />
    </div>
  )
}

SuccessCheckmark.propTypes = {
  cssModifier: PropTypes.string,
}

SuccessCheckmark.defaultProps = {
  cssModifier: "",
}

export default SuccessCheckmark
