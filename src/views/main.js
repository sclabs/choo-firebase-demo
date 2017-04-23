// imports
const html = require('choo/html');

// sub-views
const authPanel = require('./auth-panel');
const todosList = require('./todos-list');

// view
module.exports = (state, prev, send) => {
    return html`
    <div class="wrapper">
      ${authPanel(state.auth, send)}
      <div class="center">
        ${todosList(state.todos, state.auth, send)}
      </div>
    </div>
    `
};
