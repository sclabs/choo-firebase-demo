// imports
const firebase = require('firebase/app');

// get firebase auth object
const auth = firebase.auth();

// model
module.exports = {
    namespace: 'auth',
    state: {
        loggedIn: false,
        username: null,
        uid: null
    },
    reducers: {
        logout: (state, data) => ({
            loggedIn: false,
            username: null,
            uid: null
        }),
        login: (state, data) => ({
            loggedIn: true,
            username: data.username,
            uid: data.uid
        })
    },
    effects: {
        attemptLogin: (state, data, send, done) => {
            const provider = new firebase.auth.GithubAuthProvider();
            auth.signInWithPopup(provider).catch(error => {
                alert(error);
                send('auth:logout', done);
            });
        },
        attemptLogout: (state, data, send, done) => {
            auth.signOut();
            send('auth:logout', done);
        }
    },
    subscriptions: {
        loginWatcher: (send, done) => auth.onAuthStateChanged(user => {
            if (user) {
                send('auth:login', {username: user.displayName, uid: user.uid}, done);
                send('todos:watchTodos', done);
            } else {
                send('auth:logout', done);
            }
        })
    }
};
