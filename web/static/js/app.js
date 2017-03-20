/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"

import RemoteRetro from "./components/remote_retro"
import RetroChannel from "./services/retro_channel"

const remoteRetroProps = {
  userToken: window.userToken,
  retroUUID: window.retroUUID,
}

const retroChannel = RetroChannel.configure(remoteRetroProps)

const reactRoot = document.querySelector(".react-root")
render(<RemoteRetro {...remoteRetroProps} retroChannel={retroChannel} />, reactRoot)

