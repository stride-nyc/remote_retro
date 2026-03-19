import React from "react"
import capitalize from "lodash/capitalize"
import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./css_modules/idea_submission_form.css"

const SelectDropdown = ({
  labelName,
  value = undefined,
  onChange,
  selectOptions,
  showLabel = true,
}) => {
  const divClasses = showLabel ? `${styles.flex} five wide inline field` : ""
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
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  showLabel: PropTypes.bool,
}

export default SelectDropdown
