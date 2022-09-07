import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './colors.css';
import App from './App';
import seed from './seed.json';

const passwords = window.localStorage.getItem('passwords');

if (passwords === null) {
    window.localStorage.setItem('passwords', JSON.stringify(seed));
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
