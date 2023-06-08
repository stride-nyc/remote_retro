import { JSDOM } from "jsdom"

const exposedProperties = ["window", "navigator", "document"]

const jsdom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
  url: "http://localhost",
})
global.document = jsdom.window.document
global.window = document.defaultView
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: "node.js",
}
