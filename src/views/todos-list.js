// imports
const html = require('choo/html');

// view
module.exports = (state, auth, send) => {
    if (!auth.loggedIn) {
        return;
    }
    return html`
    <div>
      <form onsubmit=${submit}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.map((todo) => {
            return html`
            <li>
              <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id=${todo.id} onchange=${update}/>
              ${todo.title}
              <i class="fa fa-pencil-square-o" data-id=${todo.id}></i>
              <i class="fa fa-close" data-id=${todo.id} onclick=${remove}></i>
            </li>`
        })}
        ${state.todos.length === 0 ? 'Nothing to do!' : ''}
      </ul>
      <button onclick=${removeCompleted}>Remove completed tasks</button>
    </div>`;

    function submit(e) {
        const input = e.target.children[0];
        send('todos:addTodo', {title: input.value, completed: false, uid: auth.uid});
        input.value = '';
        e.preventDefault();
    }

    function update(e) {
        const updates = {completed: e.target.checked};
        send('todos:updateTodo', {id: e.target.getAttribute('data-id'), updates: updates});
    }

    function removeCompleted(e) {
        send('todos:removeCompleted');
    }

    function remove(e) {
        send('todos:removeTodo', {id: e.target.getAttribute('data-id')});
    }
};
