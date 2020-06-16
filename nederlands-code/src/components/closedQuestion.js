import React from 'react'
import './closedQuestion.css'

class ClosedQuestionForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { answer: ''}
    this.handleOptionSelection = this.handleOptionSelection.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown, false)
  }

    setAnswer = (value) => {
      return this.setState({ answer: value })
    }

    handleOptionSelection = (event) => {
      return this.setAnswer(event.target.value)
    }

    handleSubmit = (event) => {
      this.props.answerCallback(this.state.answer)
      this.setState({ answer: '' })
    }

    getOptionClass = (value) => {
      if (this.state.answer === value) {
        return `btn btn-primary closed-question-btn selected` 
      }
      return `btn btn-primary closed-question-btn` 
    }

    renderAlternatives = () => {
      return this.props.alternatives.map((value, idx) =>
        <li key={idx}><button className={this.getOptionClass(value)} key={idx} onClick={this.handleOptionSelection} value={value}>{value}</button></li>
      )
    }

    handleKeyDown = (event) => {
      const code = event.keyCode
      console.log(code)
      if (code >= 49 && code <= 52) {
        // It was a number within 1-4
        this.setAnswer(this.props.alternatives[code - 49])
      }
      // Spacebar or enter
      if (code === 32 || code === 13) {
        this.handleSubmit(event)
      }
    }

    render () {
      return (
        <div className="closed-question-form-container">
          <ul><li><h2>{this.props.question}</h2></li></ul>
          <div className="closed-question-container">
            <ul>
              {this.renderAlternatives()}
              <li key="submit"><button className="btn btn-primary closed-question-btn submit" type="submit" onClick={this.handleSubmit}>Check</button></li>
            </ul>
          </div>
        </div>
      )
    }
}

export default ClosedQuestionForm
