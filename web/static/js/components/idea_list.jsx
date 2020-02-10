import React, { Component } from "react"
import FlipMove from "react-flip-move"
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
          <FlipMove
            delay={500}
            duration={750}
            staggerDelayBy={100}
            easing="ease"
            enterAnimation="none"
            leaveAnimation="none"
            typeName={null}
          >
            {ideasSorted.map(idea => <Idea {...this.props} idea={idea} key={idea.id} />)}
          </FlipMove>
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
