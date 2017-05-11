import React from "react";

class ListArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: []};
  }

  componentDidMount() {
    // Get poll list from server
    this.serverRequest = $.getJSON('/api/getpolls', function (result) {
      this.setState({
        list: {result}
      });
      // console.log(JSON.stringify(result));
      this.props.setGlobalList(result);
    }.bind(this));
  }

  render() {
    // Return either a button or a welcome message based on global being set.
    var output;
    if (this.state.list.result) {
      output = this.state.list.result.map(function(data, i) {
        // Check if user has voted on this poll before.
        // More efficient way to handle this may be to add a voted names array into mongo
        var userHasVoted = false;
        data.voted.forEach(function(entry) {
          if (entry.user_id === this.props.user) {
            userHasVoted = true;
          }
        }.bind(this));
        return (
          <div className='card selectablecard' key={i} onClick={this.props.selectPoll.bind(null, data)}>
            {data.question}
          <p className='subtext'># Voters: {data.voted.length}</p>
          <p className='subtext'># Options: {data.answers.length}</p>
          {userHasVoted? <p className='subtext redtext'>You voted on this poll</p> : null}
          </div>
          );
      }, this)
    } else {
      output = '';
    }
    return (<div className="grid-by-rows">
      {output}
      </div>)
  }
}

export default ListArea;
