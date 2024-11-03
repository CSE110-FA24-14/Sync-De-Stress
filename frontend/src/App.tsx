import React from 'react';
import './App.css';
// react dom

function App() {
  return (
    <div className="App" /* later will be in other file, export const Login = () => { */>
      <header className="LoginSignUp-header">
        <p>Engage with the music you love in every way possible.</p>
      </header>
      <div>
        <form className="login-form" /* onSubmit={loginHandler} */>
          <div>
            <input
              placeholder="Email"
              /* onChange= */
            >
            </input>
          </div>

          <div>
            <input
              placeholder="Password"
              /* onChange= */
            >
            </input>
          </div>
  
          <div><button type="submit">Login</button></div>
        </form>
      </div>
      <p /* temporary, to be replaced w/ something like <Route path="/" element={<SignUp/>}/> */>
        I don't have an account.
      </p>
    </div>
  );
}

export default App;
