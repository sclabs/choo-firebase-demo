// imports
const extend = require('xtend');

// choo app init
const choo = require('choo');
const html = require('choo/html');
const app = choo();

// firebase init
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
firebase.initializeApp({
    apiKey: process.env.COFFEELOG_CHOO_FIREBASE_API_KEY,
    authDomain: 'coffeelog-choo.firebaseapp.com',
    databaseURL: 'https://coffeelog-choo.firebaseio.com'
});
const todosRef = firebase.database().ref().child('todos');

// models
app.model({
    // namespace distinguishes this model from others
    namespace: 'todos',
    // state defines the model
    state: {
        // list of todos, with fields 'id', 'title', 'completed'
        todos: []
    },
    // reducers are the low-level API for altering state with no side-effects
    reducers: {
        // total overwrite of the state, the only low-level operation we will ever need
        receiveTodos: (state, data) => {
            // data.data is an object whose keys are the id's, to solve this we use this funny map
            const todos = Object.entries(data.data).map((pair) => {
                const id = pair[0];
                const ob = pair[1];
                return extend(ob, {id});
            });
            return {todos: todos};
        }
    },
    // effects are the high-level client-driven API
    effects: {
        // add a new record, data should be something like {title, completed}
        addTodo: (state, data, send, done) => {
            const id = todosRef.push().key;
            const updates = data;
            send('todos:updateTodo', {id, updates}, done);
        },
        // update an existing record, data should be {id, updates} where updates can be at most {title, completed}
        updateTodo: (state, data, send, done) => {
            const {id, updates} = data;
            todosRef.child(id).update(updates);
        }
    },
    // subscriptions are the high-level server-driven API
    subscriptions: [
        // this subscription listens for any change in the database and receives the
        (send, done) => todosRef.on('value', snapshot => {
            send('todos:receiveTodos', {data: snapshot.val()}, done);
        })
    ]
});

// views
const view = (state, prev, send) => {
    return html`
    <div>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.todos.map((todo) => {
        return html`
          <li>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id=${todo.id} onchange=${onChange}/>
            ${todo.title}
          </li>`
        })}
      </ul>
    </div>`;

    function onSubmit(e) {
        const input = e.target.children[0];
        send('todos:addTodo', {title: input.value, completed: false});
        input.value = '';
        e.preventDefault();
    }

    function onChange(e) {
        const updates = {completed: e.target.checked};
        send('todos:updateTodo', {id: e.target.getAttribute('data-id'), updates: updates});
    }
};

// routing
app.router([
    ['/', view]
]);

// inject app into DOM
const tree = app.start();
document.body.appendChild(tree);
