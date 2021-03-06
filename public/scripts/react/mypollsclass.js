import React from "react";

class MyPolls extends React.Component {
  render() {
    console.log(JSON.stringify(this.props.globalList.result));
    // Filter globalList and only show polls with the same userid as
    //  in this.props.user
    var myPollArray = [];
    this.props.globalList.result.forEach(function(entry) {
      if (entry.creator_id === this.props.user) {
        myPollArray.push(entry);
      }
    }.bind(this));
    console.log("******** Filtering ********")
    console.log(JSON.stringify(myPollArray));
    // Iteratively render polls showing:
    // Question
    // # Voters
    // # Options
    var output = myPollArray.map(function(data, i) {
      var userHasVoted = false;
      data.voted.forEach(function(entry) {
        if (entry.user_id === this.props.user) {
          userHasVoted = true;
        }
      }.bind(this));
      return (<div className='card selectablecard' key={i} onClick={this.props.selectPoll.bind(null, data)}>
                {data.question}
                <p className='subtext'># Voters: {data.voted.length}</p>
                <p className='subtext'># Options: {data.answers.length}</p>
                {userHasVoted? <p className='subtext redtext'>You voted on this poll</p> : null}
                </div>);
    }.bind(this));
    return <div className="grid-by-rows">{output}</div>;
  }
}

export default MyPolls;
