import React from "react"

export default listItems => {
  return () => (
    <React.Fragment>
      Guidance:
      <div className="ui basic segment">
        <ul className="ui list">
          {listItems.map(listItem => {
            return <li key={listItem}>{listItem}</li>
          })}
        </ul>
      </div>
    </React.Fragment>
  )
}
