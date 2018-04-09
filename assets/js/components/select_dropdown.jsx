import React from "react"
import capitalize from "lodash/capitalize"
import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./css_modules/idea_submission_form.css"

const SelectDropdown = ({ labelName, value, onChange, selectOptions, showLabel, isRequired }) => {
  const requiredAssignee = isRequired ? "required" : ""
  const divClasses = showLabel ? `${styles.flex} five wide ${requiredAssignee} inline field` : ""
  const selectClasses = classNames("ui dropdown", {
    [styles.select]: showLabel,
  })
  const label = showLabel
    ? (<label id={styles.required} htmlFor={labelName}>{`${capitalize(labelName)}:`}</label>)
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
  isRequired: PropTypes.bool.isRequired,
}

SelectDropdown.defaultProps = {
  value: undefined,
  pointerText: "",
  showLabel: true,
}

export default SelectDropdown
