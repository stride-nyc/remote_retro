import { JSDOM } from "jsdom"

const exposedProperties = ["window", "navigator", "document"]

const jsdom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
  url: "http://localhost",
})
global.document = jsdom.window.document
global.window = document.defaultView
// getOwnPropertyNames (not keys) - jsdom defines most WebIDL interface
// constructors (HTMLCollection, NodeList, etc.) as non-enumerable own
// properties on the window instance, so Object.keys silently misses them.
Object.getOwnPropertyNames(document.defaultView).forEach(property => {
  if (typeof global[property] === "undefined") {
    try {
      global[property] = document.defaultView[property]
      exposedProperties.push(property)
    } catch (e) {
      // a handful of window properties (e.g. the literal "undefined" key
      // jsdom defines for legacy-browser compatibility) aren't assignable
      // on `global` - safe to skip, nothing relies on those.
    }
  }
})

// node >=21 ships its own global `navigator` as a getter-only property, so a
// plain assignment throws ("Cannot set property navigator... which has only
// a getter") - redefine the property instead of assigning to it.
Object.defineProperty(global, "navigator", {
  value: { userAgent: "node.js" },
  configurable: true,
  writable: true,
})
