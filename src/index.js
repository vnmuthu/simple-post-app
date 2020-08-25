import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './index.css';
import Login from './components/Login';
import PostList from './components/PostList';
import Notfound from './notfound';


const routing = (
  <Router>
    <div className="postApp">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/posts" component={PostList} />
        <Route path="/posts/:id" component={PostList} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
