import React from "react"

export default listItems => {
  return function StageChangeInfoIdeaGenerationBuilder() {
    return (
      <>
        <strong>Guidance:</strong>
        <div className="ui basic segment">
          <ul className="ui list">
            {listItems.map(listItem => {
              return <li key={listItem}>{listItem}</li>
            })}
          </ul>
        </div>
      </>
    )
  }
}
