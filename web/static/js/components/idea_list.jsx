import React, { Component } from "react"
import classNames from "classnames"
import { OverflowDetector } from "react-overflow"

import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_list.css"

class IdeaList extends Component {
  state = {
    isOverflowed: false,
  }

  handleListOverflowChange = isOverflowed => {
    this.setState({ isOverflowed })
  }

  render() {
    const { props, state } = this
    const { ideasSorted } = props

    const listContainerClasses = classNames(styles.listContainer, {
      overflowed: state.isOverflowed,
    })
    const listClasses = classNames("ideas", styles.list)

    return (
      <OverflowDetector
        onOverflowChange={this.handleListOverflowChange}
        className={listContainerClasses}
      >
        <ul
          ref={list => { this.list = list }}
          className={listClasses}
        >
          {ideasSorted.map(idea => <Idea {...this.props} idea={idea} key={idea.id} />)}
        </ul>
      </OverflowDetector>
    )
  }
}

IdeaList.propTypes = {
  ideasSorted: AppPropTypes.ideas.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

IdeaList.defaultProps = {}

export default IdeaList
