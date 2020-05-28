import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import './App.css'
import VerbsOpenQuestion from './components/verbs'
import Home from './components/home'

function App () {
  return (
    <div className="App">
      <Router basename={'/nederlands'}>
        <Switch>
          <Route exact path={'/'}>
            <Home />
          </Route>
          <Route path={'/werkwoorden/:id'}>
            <VerbsOpenQuestion />
          </Route>
        </Switch>
      </Router>
    </div >
  )
}

export default App
