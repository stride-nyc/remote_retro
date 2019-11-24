import React, { Component } from "react"
import FlipMove from "react-flip-move"
import classNames from "classnames"

import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/idea_list.css"

class IdeaList extends Component {
  state = {}

  componentDidMount() {
    this.honorScrollabilityOfContent()
    this.scrollabilityInterval = setInterval(this.honorScrollabilityOfContent, 300)
  }

  componentWillUnmount() {
    clearInterval(this.scrollabilityInterval)
  }

  honorScrollabilityOfContent = () => {
    const { list, state } = this

    const overflowed = list.offsetHeight < list.scrollHeight
    if (overflowed !== state.overflowed) {
      this.setState({ overflowed })
    }
  }

  render() {
    const { props, state } = this
    const { category, ideas } = props
    const classes = classNames("ideas", category, styles.list, {
      overflowed: state.overflowed,
    })

    return (
      <ul
        ref={list => { this.list = list }}
        className={classes}
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
          {ideas.map(idea => <Idea {...this.props} idea={idea} key={idea.id} />)}
        </FlipMove>
      </ul>
    )
  }
}

IdeaList.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

IdeaList.defaultProps = {}

export default IdeaList
