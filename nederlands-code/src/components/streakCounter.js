import React from 'react'

class StreakCounter extends React.Component {
  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <h3>Current streak: {this.props.current}</h3>
          </div>
          <div className="col-sm">
            <h3>Record: {this.props.record}</h3>
          </div>
        </div>
      </div>
    )
  }
}

export default StreakCounter
