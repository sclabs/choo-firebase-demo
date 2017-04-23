// imports
const html = require('choo/html');

// view
module.exports = (auth, send) => {
    if (auth.loggedIn) {
        return html`
        <div class="authpanel">
          <span>Logged in as ${auth.username}.</span>
          <button onclick=${attemptLogout}>Log out</button>
        </div>
        `;
    }
   else {
       return html`
       <div class="authpanel">
         <button onclick=${attemptLogin}>Log in</button>
       </div>
       `
    }

    function attemptLogin(e) {
        send('auth:attemptLogin');
    }

    function attemptLogout(e) {
        send('auth:attemptLogout');
    }
};
