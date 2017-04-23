// imports
const choo = require('choo');
const firebase = require('firebase/app');

// firebase init
require('firebase/auth');
require('firebase/database');
firebase.initializeApp({
    apiKey: 'AIzaSyDyDLpOl5mh1pCITkltvYizZFyj65tVB24',
    authDomain: 'coffeelog-choo.firebaseapp.com',
    databaseURL: 'https://coffeelog-choo.firebaseio.com'
});

// choo app init
const app = choo();
app.model(require('./models/auth'));
app.model(require('./models/todos'));
app.router([
    ['/', require('./views/main')]
]);

// inject app into DOM
const tree = app.start();
document.body.appendChild(tree);
