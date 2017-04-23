// imports
const extend = require('xtend');
const firebase = require('firebase/app');

// firebase ref
const auth = firebase.auth();
const todosRef = firebase.database().ref().child('todos');

// model
module.exports = {
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
            const id = todosRef.child(auth.getUid()).push().key;
            const updates = data;
            send('todos:updateTodo', {id, updates}, done);
            console.log(auth.getUid());
        },
        // update an existing record, data should be {id, updates} where updates can be at most {title, completed}
        updateTodo: (state, data, send, done) => {
            const {id, updates} = data;
            todosRef.child(auth.getUid()).child(id).update(updates);
        },
        // effect endpoint for setting a watcher for this model
        watchTodos: (state, data, send, done) => {
            todosRef.child(auth.getUid()).on('value', snapshot => {
                send('todos:receiveTodos', {data: snapshot.val()}, done);
            });
        },
        removeCompleted: (state, data, send, done) => {
            const updates = {};
            for (let i=0; i < state.todos.length; i++) {
                if (state.todos[i].completed) {
                    updates[state.todos[i].id] = null;
                }
            }
            todosRef.child(auth.getUid()).update(updates);
        }
    }
};
