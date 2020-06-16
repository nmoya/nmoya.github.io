import React from 'react'
import './closedQuestionResult.css'

class CorrectAnswer extends React.Component {
  render () {
    return (
      <div className="answer answer-correct">
        <div className="result-text-container">
          <ul>
            <li>Goed Gedaan! ✅ </li>
          </ul>
        </div>
        <div className="result-button-container">
          <button className="result-next-button" onClick={this.props.nextExercise}>Next Exercise</button>
        </div>
      </div>
    )
  }
}

class WrongAnswer extends React.Component {
  render () {
    return (
      <div className="answer answer-wrong">
        <div className="result-text-container">
          <ul>
            <li className="font-small">Nee, Sorry ❌</li>
            <li className="color-black">{this.props.exercise.question.Nederlands}</li>
            <li>{this.props.exercise.question.Engels}</li>
          </ul>
        </div>
        <div className="result-button-container">
          <button className="result-next-button" onClick={this.props.nextExercise}>Next Exercise</button>
        </div>
      </div>
    )
  }
}

class ClosedQuestionResult extends React.Component {
  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown, false)
  }

  handleKeyDown = (event) => {
    const code = event.keyCode
    // Spacebar
    if (code === 32 || code === 13) {
      this.props.nextExercise()
    }
  }

  render () {
    return (
      <div className="input-group mb-3">
        <div className="input-group-append">
          {this.props.isCorrect
            ? <CorrectAnswer />
            : <WrongAnswer exercise={this.props.exercise} />}
        </div>
      </div>)
  }
}

export default ClosedQuestionResult
