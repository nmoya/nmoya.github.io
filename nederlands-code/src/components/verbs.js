import React from 'react'
import {
  withRouter
} from 'react-router-dom'
import ResultsComponent from './results'
import StreakCounter from './streakCounter'
import werkwordenJson from '../data/werkworden.json'
import OpenQuestionForm from './openQuestion'
import h1Json from '../data/h1.json'
import h2Json from '../data/h2.json'
import h3Json from '../data/h3.json'

const VerbsData = {
  werkworden: werkwordenJson,
  h1: h1Json,
  h2: h2Json,
  h3: h3Json
}

class PracticeWithoutRouter extends React.Component {
  constructor (props) {
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
      difficulty: 'werkworden'
    }
  }

    prepareExercise = () => {
      const exercisePool = VerbsData[this.state.difficulty]
      if (typeof exercisePool !== 'undefined') {
        this.setState({
          exercise: exercisePool[exercisePool.length * Math.random() | 0]
        })
      }
    }

    checkAnswer = (input) => {
      const criteria = ['Imperfectum', 'Perfectum']
      const answer = input.split(',').map(x => x.trim())
      const results = answer.map((value, idx) => value.toLowerCase() === this.state.exercise[criteria[idx]].toLowerCase())
      const allCorrect = results.reduce((acc, value) => {
        return acc && value
      }, true)
      const newStreak = allCorrect ? this.state.score.currentStreak + 1 : 0
      const newMaxScore = newStreak > this.state.score.maxStreak ? newStreak : this.state.score.maxStreak
      this.setState({
        lastAnswer: {
          areAllCorrect: allCorrect,
          words: answer,
          results: results,
          criteria: criteria,
          exercise: this.state.exercise
        },
        score: {
          currentStreak: newStreak,
          maxStreak: newMaxScore
        }
      }, this.prepareExercise)
    }

    componentDidMount = () => {
      this.setState({
        difficulty: this.props.match.params.id
      }, this.prepareExercise)
    }

    buildQuestion = () => {
      return `${this.state.exercise.Infinitief} (${this.state.exercise.Vertaling})`
    }

    buildDescription = () => {
      return (
        <div>If the verb is <b>gaan</b> you need to type: 'ging, is gegaan':</div>
      )
    }

    buildPlaceholder = () => {
      return 'Imperfectum, (is) perfectum'
    }

    render () {
      return (
        <div>
          <StreakCounter current={this.state.score.currentStreak} record={this.state.score.maxStreak}/>
          <br></br>
          <OpenQuestionForm question={this.buildQuestion()} description={this.buildDescription()} placeholder={this.buildPlaceholder()} answerCallback={this.checkAnswer} />
          {this.state.lastAnswer.areAllCorrect === null ? null : <ResultsComponent lastAnswer={this.state.lastAnswer} />}
          <br></br>
          <br></br>
          <h5>Set of verbs: {this.state.difficulty}</h5>
        </div>
      )
    }
}

const VerbsOpenQuestion = withRouter(PracticeWithoutRouter)

export default VerbsOpenQuestion
