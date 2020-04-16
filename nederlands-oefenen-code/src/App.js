import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import './App.css';
import VerbsData from './werkworden.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route exact path="/">
              <Practice />
            </Route>
            <Route path="/:id">
              <Practice />
            </Route>
          </Switch>
        </Router>
      </header>
    </div >
  );
}

function Home() {
  return (
    <div>
      <h1>Welkom! Kies jouew moeilijkheid:</h1>
      {/* Remember to give different URLs to each button and add to the router above */}
      {/* <Link to="/practice-basiswerkwoorden"><button class="btn btn-primary" type="submit">Basiswerkwoorden (Oranje)</button></Link> */}
      <Link to="/practice"><button class="btn btn-primary" type="submit">Basiswerkwoorden (Oranje)</button></Link>
    </div>
  );
}

// Move to components folder
function VerbForm(props) {
  return (
    <div>
      <h2>{props.verb} ({props.translation})</h2>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="imperfectum, (is) perfectum" />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" id="submit-answer">Check</button>
        </div>
      </div>
    </div>
  );
}

class PracticeWithoutRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      exercise: { verb: "beginnen", translation: "to begin" },
      difficulty: undefined
    }
  }
  prepareExercise() {
    console.log(VerbsData[VerbsData.length * Math.random() | 0])
    this.setState({
      exercise: VerbsData[VerbsData.length * Math.random() | 0]
    })
  }

  componentDidMount() {
    this.setState({
      difficulty: this.props.match.params.id,
    })
    this.prepareExercise()
  }

  render() {
    return (
      <div>
        {/* <h3>Difficulty: {this.state.difficulty}</h3> */}
        <br></br>
        <VerbForm verb={this.state.exercise.Infinitief} translation={this.state.exercise.Vertaling}></VerbForm>
      </div>
    );
  }
}
const Practice = withRouter(PracticeWithoutRouter);

export default App;
