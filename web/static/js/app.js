/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"

import RemoteRetro from "./components/remote_retro"

const remoteRetroProps = {
  userToken: window.userToken,
  retroUUID: window.retroUUID,
}

const reactRoot = document.querySelector(".react-root")
render(<RemoteRetro {...remoteRetroProps} />, reactRoot)

