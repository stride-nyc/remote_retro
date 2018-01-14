import React from "react"
import { capitalize } from "lodash"
import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./css_modules/idea_submission_form.css"

const SelectDropdown = ({ labelName, value, onChange, selectOptions, showLabel }) => {
  const divClasses = showLabel ? `${styles.flex} five wide inline field`: ""
  const selectClasses = classNames("ui dropdown", {
    [styles.select]: showLabel,
  })
  const label = showLabel
    ? (<label htmlFor={labelName}>{`${capitalize(labelName)}:`}</label>)
    : ""
  return (
    <div className={divClasses}>
      {label}
      <select
        id={labelName}
        name={labelName}
        value={value}
        className={selectClasses}
        onChange={onChange}
      >
        {selectOptions}
      </select>
    </div>
  )
}

SelectDropdown.propTypes = {
  labelName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  pointerText: PropTypes.string,
  showLabel: PropTypes.bool,
}

SelectDropdown.defaultProps = {
  value: undefined,
  pointerText: "",
  showLabel: true,
}

export default SelectDropdown
