const isProd = location.host === "remoteretro.org"
const { __REDUX_DEVTOOLS_EXTENSION__ } = window

const reduxDevToolsEnabled = !isProd && __REDUX_DEVTOOLS_EXTENSION__
const storeEnhancer =
  reduxDevToolsEnabled ? __REDUX_DEVTOOLS_EXTENSION__() : f => f

export default storeEnhancer
