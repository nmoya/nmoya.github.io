import React from 'react'

class OpenQuestionForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { answer: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

    handleChange = (event) => {
      this.setState({ answer: event.target.value })
    }

    handleSubmit = (event) => {
      event.preventDefault()
      this.props.answerCallback(this.state.answer)
      this.setState({ answer: '' })
    }

    render () {
      return (
        <div>
          <h2>{this.props.question}</h2>
          <div className="input-group mb-3">
            <div className="input-group-append">
              <form className="form-layout" onSubmit={this.handleSubmit}>
                <span className="help-input">{this.props.description}</span>
                <input value={this.state.answer} onChange={this.handleChange} type="text" className="form-control" placeholder={this.props.placeholder} />
                <button className="btn btn-outline-secondary" type="submit" id="submit-answer">Check</button>
              </form>
            </div>
          </div>
        </div>
      )
    }
}

export default OpenQuestionForm
