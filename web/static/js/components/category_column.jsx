import React from "react";
import PropTypes from "prop-types";
import { useDroppable, DndContext } from "@dnd-kit/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import cx from "classnames";

import IdeaColumnListContainer from "./idea_column_list_container";
import * as AppPropTypes from "../prop_types";
import styles from "./css_modules/category_column.css";
import { actions as actionCreators } from "../redux";

const CategoryColumn = ({ category, categoryDisplayStringOverride = null, ideas, actions, votes, stage, currentUser, ideaGenerationCategories }) => {
  const state = {}
  const { isOver, setNodeRef } = useDroppable({
    id: category, // Unique ID for the droppable column
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const draggedIdea = active.data.current;
      if (draggedIdea.category !== category) {
        actions.submitIdeaEditAsync({ ...draggedIdea, category });
      }
    }
  };

  const iconHeight = 23;
  const wrapperClasses = cx(category, "column", styles.index, {
    "dragged-over": isOver,
  });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <section ref={setNodeRef} className={wrapperClasses}>
        <div className={`${styles.columnHead} ui center aligned basic segment`}>
          <img
            src={`${ASSET_DOMAIN}/images/${category}.svg`}
            height={iconHeight}
            width={iconHeight}
            alt={category}
          />
          <p className="ui medium header">{categoryDisplayStringOverride || category}</p>
        </div>
        <div className={`ui fitted divider ${styles.divider}`} />
        {!!ideas.length && <IdeaColumnListContainer category={category} ideas={ideas} votes={votes} stage={stage} currentUser={currentUser} ideaGenerationCategories={ideaGenerationCategories} actions={actions} />}
        <span className="overlay" />
      </section>
    </DndContext>
  );
};

CategoryColumn.propTypes = {
  ideas: AppPropTypes.ideas.isRequired,
  category: AppPropTypes.category.isRequired,
  categoryDisplayStringOverride: PropTypes.string,
  actions: AppPropTypes.actions.isRequired,
  votes: AppPropTypes.votes.isRequired,
  stage: AppPropTypes.stage.isRequired,
};

const mapStateToProps = ({ ideas, votes }, props) => ({
  votes,
  ideas: ideas.filter(idea => idea.category === props.category),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryColumn);
