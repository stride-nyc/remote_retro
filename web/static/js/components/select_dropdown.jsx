import React from "react"
import { capitalize } from "lodash"
import PropTypes from "prop-types"

import styles from "./css_modules/idea_submission_form.css"

const SelectDropdown = ({ labelName, value, onChange, selectOptions, pointerText }) => {
  let pointingLabel = null

  if (pointerText) {
    pointingLabel = (
      <div className={`${styles.pointingLabel} floating ui pointing below teal label`}>
        {pointerText}
      </div>
    )
  }

  return (
    <div className={`${styles.flex} five wide inline field`}>
      {pointingLabel}
      <label htmlFor={labelName}>{`${capitalize(labelName)}:`}</label>
      <select
        id={labelName}
        name={labelName}
        value={value}
        className={`ui dropdown ${styles.select}`}
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
}

SelectDropdown.defaultProps = {
  value: undefined,
  pointerText: "",
}

export default SelectDropdown
