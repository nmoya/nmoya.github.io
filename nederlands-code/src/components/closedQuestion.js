import React from 'react'

class ClosedQuestionForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { answer: '' }

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

    renderAlternatives = () => {
      return this.props.alternatives.map((value, idx) =>
        <button className="btn btn-primary" key={idx} onClick={this.handleOptionSelection} value={value}>{value}</button>
      )
    }

    handleKeyDown = (event) => {
      const code = event.keyCode
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
      console.log(this.state.answer)
      return (
        <div>
          <h2>{this.props.question}</h2>
          <div className="input-group mb-3">
            <div className="input-group-append">
              {this.renderAlternatives()}
              <button className="btn btn-outline-secondary" type="submit" onClick={this.handleSubmit}>Check</button>
            </div>
          </div>
        </div>
      )
    }
}

export default ClosedQuestionForm
