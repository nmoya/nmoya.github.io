import React from 'react'
import {
  withRouter
} from 'react-router-dom'
import ClosedQuestionResult from './closedQuestionResult'
import StreakCounter from './streakCounter'
import vh1Json from '../data/vh1.json'
import vh2Json from '../data/vh2.json'
import ClosedQuestionForm from './closedQuestion'

class PracticeWithoutRouter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      exercise: {
        question: '',
        options: []
      },
      score: { currentScore: 0, maxScore: 0 },
      lastAnswer: {
        words: [],
        results: [],
        criteria: [],
        exercise: {
          question: '',
          options: [],
        },
        areAllCorrect: null
      },
      difficulty: 'vh1',
      data: {
        vh1: vh1Json,
        vh2: vh2Json
      },
      numberOfAlternatives: 4
    }
  }

    componentDidMount = () => {
      this.setState({
        difficulty: 'vh1'
      }, this.prepareExercise)
    }

    exercisePool = () => {
      return this.state.data[this.state.difficulty]
    }

    randomExercise = (listOfExercises) => {
      return listOfExercises[listOfExercises.length * Math.random() | 0]
    }

    shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    prepareExercise = () => {
      const exercisePool = this.exercisePool()
      if (typeof exercisePool !== 'undefined') {
        const question = this.randomExercise(exercisePool)
        const options = [question.Engels]
        while (options.length !== this.state.numberOfAlternatives) {
          const option = this.randomExercise(exercisePool)
          if (!options.includes(option.Engels)) {
            options.push(option.Engels)
          }
        }
        this.setState({
          exercise: {
            question: question,
            options: this.shuffle(options)
          },
          lastAnswer: {
            isCorrect: null,
            exercise: this.state.exercise
          }
        })
      }
    }

    checkAnswer = (input) => {
      const answer = this.state.exercise.question.Engels
      const correct = answer.toLowerCase() === input.toLowerCase()
      const newScore = correct ? this.state.score.currentScore + 1 : 0
      const newMaxScore = newScore > this.state.score.maxScore ? newScore : this.state.score.maxScore
      this.setState({
        lastAnswer: {
          isCorrect: correct,
          exercise: this.state.exercise
        },
        score: {
          currentScore: newScore,
          maxScore: newMaxScore
        }
      })
    }

    buildQuestion = () => {
      return `${this.state.exercise.question.Nederlands}`
    }

    changeDifficulty = (event) => {
      this.setState({ difficulty: event.target.value }, this.prepareExercise)
    }

    renderMainArea = () => {
      if (this.state.lastAnswer.isCorrect === null) {
        return <ClosedQuestionForm question={this.buildQuestion()} alternatives={this.state.exercise.options} answerCallback={this.checkAnswer} />
      } else {
        const isCorrect = this.state.lastAnswer.isCorrect
        const exercise = this.state.lastAnswer.exercise
        return <ClosedQuestionResult isCorrect={isCorrect} exercise={exercise} nextExercise={this.prepareExercise} />
      }
    }

    render () {
      return (
        <div className="">
          <select className="" value={this.state.difficulty} onChange={this.changeDifficulty}>
            <option value="vh1">Vocabulaire Hoofdstuck 1</option>
            <option value="vh2">Vocabulaire Hoofdstuck 2</option>
          </select>
          {/* <ClosedQuestionResult isCorrect={true} exercise={{ Nederlands: 'tandarts', Engels: 'dentist' }} nextExercise={this.prepareExercise}/> */}
          {/* <ClosedQuestionResult isCorrect={false} exercise={{ Nederlands: 'tandarts', Engels: 'dentist' }} nextExercise={this.prepareExercise}/> */}
          <StreakCounter current={this.state.score.currentScore} record={this.state.score.maxScore}/>
          {this.renderMainArea()}
        </div>
      )
    }
}

const VocabulaireClosedQuestion = withRouter(PracticeWithoutRouter)

export default VocabulaireClosedQuestion
