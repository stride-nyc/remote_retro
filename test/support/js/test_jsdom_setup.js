import { JSDOM } from "jsdom"

const exposedProperties = ["window", "navigator", "document"]

const jsdom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
  url: "http://localhost",
})
global.document = jsdom.window.document
global.window = document.defaultView
// jsdom exposes some globals (e.g. HTMLCollection) as non-enumerable getters,
// which Object.keys skips - use getOwnPropertyNames instead, and guard the
// assignment since a few of those getters throw when accessed this way.
Object.getOwnPropertyNames(document.defaultView).forEach(property => {
  if (typeof global[property] === "undefined") {
    try {
      exposedProperties.push(property)
      global[property] = document.defaultView[property]
    } catch (e) {
      // not exposable on the global object - skip it
    }
  }
})

global.navigator = {
  userAgent: "node.js",
}
