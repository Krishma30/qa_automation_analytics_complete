import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../containers/Home';
//import Before from '../containers/Before';
import ErrorsTable from '../containers/ErrorsTable';
import Analytics from '../containers/Analytics';


const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/errors/:sessionId" component={ErrorsTable} />

    </Switch>
  </main>
);

export default Main;
