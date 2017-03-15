/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"

import RemoteRetro from "./components/remote_retro"
import RetroChannel from "./services/retro_channel"

const userToken = window.userToken

const retroChannelConfiguration = { userToken, retroUUID: window.retroUUID }
const retroChannel = RetroChannel.configure(retroChannelConfiguration)

const reactRoot = document.querySelector(".react-root")

render(<RemoteRetro retroChannel={retroChannel} userToken={userToken} />, reactRoot)
