import React, { Component } from "react"
import PropTypes from "prop-types"
import Modal from "react-modal"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { actions as actionCreators } from "../redux"
import styles from "./css_modules/alert.css"

Modal.defaultStyles.content.zIndex = 2
Modal.defaultStyles.overlay.zIndex = 2
Modal.setAppElement("body")

export class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: props.config,
      isOpen: !!props.config,
    }
  }

  static getDerivedStateFromProps(props, state) {
    const isOpen = !!props.config

    return {
      config: isOpen ? props.config : state.config,
      isOpen,
    }
  }

  render() {
    const { actions } = this.props
    const { config, isOpen } = this.state

    if (!config) return null

    const { headerText, BodyComponent } = config

    return (
      <Modal
        className={`modal ${styles.wrapper}`}
        overlayClassName={styles.overlay}
        contentLabel="Alert"
        isOpen={isOpen}
        closeTimeoutMS={process.env.NODE_ENV === "test" ? 1 : 250} // avoid delayed removal in e2e tests
      >
        <div className="ui basic padded clearing segment">
          <p className="ui dividing huge header">
            {headerText}
          </p>
          <div className={`ui content ${styles.guidance}`}>
            <BodyComponent />
          </div>
          <br />
          <button
            autoFocus  
            type="button"
            className="ui blue right floated button"
            onClick={actions.clearAlert}
          >
            Got it!
          </button>
        </div>
      </Modal>
    )
  }
}

Alert.propTypes = {
  actions: PropTypes.object,
  config: PropTypes.object,
}

Alert.defaultProps = {
  actions: {},
  config: null,
}

const mapStateToProps = state => ({
  alert: state.alert,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alert)
