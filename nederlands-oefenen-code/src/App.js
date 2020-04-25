import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import './App.css';
import werkworden_json from './werkworden.json';
import h1_json from './h1.json';

const VerbsData = {
  "werkworden": werkworden_json,
  "h1": h1_json
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:id">
            <Practice />
          </Route>
        </Switch>
      </Router>
    </div >
  );
}

function Home() {
  return (
    <div>
      <h1>Welkom! Kies jouew moeilijkheid:</h1>
      {/* Remember to give different URLs to each button and add to the router above */}
      {/* <Link to="/basiswerkwoorden"><button class="btn btn-primary" type="submit">Basiswerkwoorden (Oranje)</button></Link> */}
      <Link to="/werkworden"><button class="btn btn-primary" type="submit">Basiswerkwoorden (Oranje)</button></Link>
      <br></br>
      <br></br>
      <Link to="/h1"><button class="btn btn-primary" type="submit">Hoofdstuck 1</button></Link>
    </div>
  );
}

// Move to components folder
class VerbForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { answer: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({ answer: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.answerCallback(this.state.answer);
    this.setState({ answer: '' });
  }

  render() {
    return (
      <div>
        <h2>{this.props.verb} ({this.props.translation})</h2>
        <div className="input-group mb-3">
          <div className="input-group-append">
            <form className="form-layout" onSubmit={this.handleSubmit}>
              <span className="help-input">Type "Imperfectum" and "(is) perfectum":</span>
              <input value={this.state.answer} onChange={this.handleChange} type="text" className="form-control" placeholder="Imperfectum, (is) perfectum" />
              <button className="btn btn-outline-secondary" type="submit" id="submit-answer">Check</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class PracticeWithoutRouter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      exercise: {},
      score: { currentStreak: 0, maxStreak: 0 },
      lastAnswer: {
        words: [],
        results: [],
        criteria: [],
        exercise: {},
        areAllCorrect: null
      },
      difficulty: undefined
    }
  }

  prepareExercise = () => {
    let exercisePool = VerbsData[this.state.difficulty]
    this.setState({
      exercise: exercisePool[exercisePool.length * Math.random() | 0]
    })
  }

  checkAnswer = (input) => {
    const criteria = ["Imperfectum", "Perfectum"]
    const answer = input.split(",").map(x => x.trim())
    const results = answer.map((value, idx) => value === this.state.exercise[criteria[idx]])
    const allCorrect = results.reduce((acc, value) => {
      return acc && value
    }, true)
    const newStreak = allCorrect ? this.state.score.currentStreak + 1 : 0;
    const newMaxScore = newStreak > this.state.score.maxStreak ? newStreak : this.state.score.maxStreak;
    this.setState({
      lastAnswer: {
        areAllCorrect: allCorrect,
        words: answer,
        results: results,
        criteria: criteria,
        exercise: this.state.exercise,
      },
      score: {
        currentStreak: newStreak,
        maxStreak: newMaxScore,
      }
    }, this.prepareExercise)
  }

  componentDidMount = () => {
    this.setState({
      difficulty: this.props.match.params.id,
    }, this.prepareExercise)
  }

  render() {
    return (
      <div>
        <h3>Streak: {this.state.score.currentStreak} Record: {this.state.score.maxStreak}</h3>
        <br></br>
        <VerbForm verb={this.state.exercise.Infinitief} translation={this.state.exercise.Vertaling} answerCallback={this.checkAnswer} />
        {this.state.lastAnswer.areAllCorrect === null ? null : <ResultsComponent lastAnswer={this.state.lastAnswer} />}
        <br></br>
        <br></br>
        <h5>Difficulty: {this.state.difficulty}</h5>
      </div>
    );
  }
}

class CorrectWord extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <span>{this.props.word} ✅ </span>
    );
  }
}
class WrongWord extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <span><strike>{this.props.word}</strike> {this.props.correction}<br></br></span>
    );
  }
}

class CorrectAnswer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="answer answer-correct">
        <p>
          {this.props.lastAnswer.words.map((value, _) => {
            return <CorrectWord word={value} />
          })}
        </p>
      </div>
    );
  }
}

class WrongAnswer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="answer answer-wrong">
        <p>
          {this.props.lastAnswer.results.map((isCorrect, i) => {
            if (isCorrect) {
              return <CorrectWord word={this.props.lastAnswer.words[i]} />;
            } else {
              const criteria = this.props.lastAnswer.criteria;
              return <WrongWord word={this.props.lastAnswer.words[i]} correction={this.props.lastAnswer.exercise[criteria[i]]} />
            }
          })}
        </p>
      </div>
    );
  }
}

class ResultsComponent extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-append">
          {this.props.lastAnswer.areAllCorrect ?
            <CorrectAnswer lastAnswer={this.props.lastAnswer} /> :
            <WrongAnswer lastAnswer={this.props.lastAnswer} />}
        </div>
      </div>);
  }
}

const Practice = withRouter(PracticeWithoutRouter);

export default App;
