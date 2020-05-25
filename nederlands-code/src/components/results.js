import React from 'react';

class CorrectWord extends React.Component {
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

export default ResultsComponent;