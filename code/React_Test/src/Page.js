import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Regiser from './Register'
import Login from './Login'
import 'antd/dist/antd.css';

export default () => (
    <Router>
        <Switch>
            <Route path="/register" component={Regiser}/>
            <Route path="/login" component={Login}/>
            <Route path="/user" component={App} />  
        </Switch>
    </Router>
);
