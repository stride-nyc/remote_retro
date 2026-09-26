---
paths:
  - "web/static/js/components/**/*.jsx"
---

# React components

- Class components extending `Component` (this codebase predates hooks — don't introduce function components/hooks here without discussing it first, for consistency with the rest of the tree).
- File names are `snake_case.jsx`; the class itself is `PascalCase` (e.g. `idea_edit_form.jsx` → `class IdeaEditForm extends Component`).
- Props are validated with `PropTypes` plus the project's shared shapes from `AppPropTypes` (`import * as AppPropTypes from "../prop_types"`) — reuse an existing shape (`AppPropTypes.idea`, `AppPropTypes.presence`, `AppPropTypes.actions`, ...) instead of redefining an inline shape for a domain object that already has one.
- Event handlers and other instance methods are class fields defined as arrow functions (`onSubmit = event => { ... }`), not bound in the constructor.
- Local UI state lives in `this.state`, initialized from props in the constructor; anything shared across components goes through Redux instead.
- JSX class names follow Semantic UI conventions (e.g. `"ui positive button"`, `"ui error form raised segment"`); use `classnames` for conditional class composition rather than manual string concatenation.
- Each component that needs styling gets a matching CSS module under `css_modules/` with the same base filename.
