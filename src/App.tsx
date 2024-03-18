import React from 'react';
import logo from './logo.svg';
import './App.css';
import TelegramLoginButton from './components/TelegramLoginButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

          <TelegramLoginButton
            botName={process.env.REACT_APP_BOTNAME ?? ''}
            dataOnauth={(user: unknown) => console.log(user)}
            dataAuthUrl={process.env.REACT_APP_AUTH_TG}
          />

      </header>
    </div>
  );
}

export default App;
