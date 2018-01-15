import React, { Component } from "react"
import { connect } from "react-redux"
import countBy from "lodash/countBy"
import FlipMove from "react-flip-move"
import ShadowedScrollContainer from "./shadowed_scroll_container"
import Idea from "./idea"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/category_column.css"
import STAGES from "../configs/stages"

const { VOTING, ACTION_ITEMS, CLOSED } = STAGES

export class CategoryColumn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animateSort: props.stage === ACTION_ITEMS || props.stage === CLOSED,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stage === VOTING && nextProps.stage === ACTION_ITEMS) {
      const timeout = setTimeout(() => {
        this.setState({ animateSort: true })
        clearTimeout(timeout)
      }, 2000)
    }
  }

  handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  handleDrop = event => {
    event.preventDefault()
    const { category, retroChannel } = this.props
    const { id, body, assignee_id: assigneeId } = JSON.parse(event.dataTransfer.getData("idea"))

    retroChannel.push("idea_edited", {
      id,
      body,
      assigneeId,
      category,
    })
  }

  render() {
    const { handleDrop, handleDragOver } = this
    const { category, ideas, votes } = this.props
    const filteredIdeas = ideas.filter(idea => idea.category === category)
    const iconHeight = 45

    let sortedIdeas
    if (this.state.animateSort && category !== "action-item") {
      const voteCountsByIdea = countBy(votes, "idea_id")
      sortedIdeas = filteredIdeas.sort((a, b) => {
        const voteCountForIdeaA = voteCountsByIdea[a.id] || 0
        const voteCountForIdeaB = voteCountsByIdea[b.id] || 0
        if (voteCountForIdeaB === voteCountForIdeaA) { return a.id - b.id }
        return voteCountForIdeaB - voteCountForIdeaA
      })
    } else {
      sortedIdeas = filteredIdeas.sort((a, b) => a.id - b.id)
    }

    const ideasList = (
      <FlipMove
        duration={750}
        staggerDelayBy={100}
        easing="ease"
        enterAnimation="none"
        leaveAnimation="none"
        typeName={null}
      >
        {sortedIdeas.map(idea => <Idea {...this.props} idea={idea} key={idea.id} />)}
      </FlipMove>
    )

    return (
      <section className={`${category} ${styles.index} column`} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className={` ${styles.columnHead} ui center aligned basic segment`}>
          <img src={`/images/${category}.svg`} height={iconHeight} width={iconHeight} alt={category} />
          <p><strong>{category}</strong></p>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        { !!sortedIdeas.length &&
          <ShadowedScrollContainer contentMaxHeight="50vh">
            <ul className={`${category} ${styles.list} ideas`}>
              {ideasList}
            </ul>
          </ShadowedScrollContainer>
        }
      </section>
    )
  }
}

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  votes: AppPropTypes.votes.isRequired,
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: AppPropTypes.stage.isRequired,
}

const mapStateToProps = ({ votes }) => ({ votes })

export default connect(
  mapStateToProps
)(CategoryColumn)
