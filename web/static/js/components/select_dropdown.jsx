import React from "react"
import capitalize from "lodash/capitalize"
import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./css_modules/idea_submission_form.css"

const SelectDropdown = ({ labelName, value, onChange, selectOptions, showLabel }) => {
  const divClasses = showLabel ? `${styles.flex} five wide inline field` : ""
  const selectClasses = classNames("ui dropdown", {
    [styles.select]: showLabel,
  })
  return (
    <div className={divClasses}>
      {showLabel && (
        <label htmlFor={`select-${labelName}`}>
          {`${capitalize(labelName)}:`}
          <select
            id={`select-${labelName}`}
            name={labelName}
            value={value}
            className={selectClasses}
            onChange={onChange}
          >
            {selectOptions}
          </select>
        </label>
      )}
      {!showLabel && (
        <select
          name={labelName}
          value={value}
          className={selectClasses}
          onChange={onChange}
        >
          {selectOptions}
        </select>
      )}
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
