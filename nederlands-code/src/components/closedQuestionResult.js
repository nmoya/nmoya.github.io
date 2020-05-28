import React from 'react'

class CorrectAnswer extends React.Component {
  render () {
    return (
      <div className="answer answer-correct">
        <p>
          <span>Goed Gedaan! ✅ </span>
        </p>
      </div>
    )
  }
}

class WrongAnswer extends React.Component {
  render () {
    return (
      <div className="answer answer-wrong">
        <p>Nee, Sorry ❌</p>
        <p></p>
        <p>{this.props.exercise.Nederlands}</p>
        <p>{this.props.exercise.Engels}</p>
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
        <button onClick={this.props.nextExercise}>Next Exercise</button>
      </div>)
  }
}

export default ClosedQuestionResult
