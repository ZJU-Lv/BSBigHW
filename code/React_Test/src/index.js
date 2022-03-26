import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import 'react-app-polyfill/ie11';
import './index.css';
import 'antd/dist/antd.css';
import Page from './Page';
import './mock';
import * as serviceWorker from './serviceWorker';
require('es6-symbol/implement');
ReactDOM.render(
    <Page />,
  document.getElementById('root')
);
serviceWorker.unregister();