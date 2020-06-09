import React from 'react'
import ReactDOM from 'react-dom'

class Application extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    console.log('hello');
  }

  render() {
    return (
      <div>
    
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
