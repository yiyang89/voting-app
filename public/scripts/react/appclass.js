console.log("voting.js loaded successfully");

// React classes
var AppComponent = React.createClass({
  getInitialState: function() {
    if (myPoll) {
      return {
        showList: false,
        pollTarget: myPoll,
        showCreateNew: false,
        showPollDetails: true,
        globalList: []
      };
    } else {
      var login = accessTokenFromServer? true : false;
      if (login) {
        localStorage._decky_accesstoken = accessTokenFromServer;
      }
      return {
        username: username,
        accesstokenserver: accessTokenFromServer,
        accesstokenlocal: localStorage._decky_accesstoken,
        loggedin: login,
        showList: true,
        pollTarget: {},
        showCreateNew: false,
        showPollDetails: false,
        globalList: []
      };
    }
  },
  componentWillMount: function() {
    if (localStorage._decky_accesstoken) {
      // User is currently logged in
        $.getJSON('/tokendetails/'+localStorage._decky_accesstoken, function(result) {
          this.setState({
            username: result.profile.name.givenName,
            accesstokenserver: result.accessToken,
            accesstokenlocal: localStorage._decky_accesstoken,
            loggedin: true
          })
        }.bind(this))
    }
  },
  logout: function() {
    // Empty localstorage
    $.getJSON('/logout/'+accessTokenFromServer, function(result) {
      localStorage._decky_accesstoken = null;
      this.setState({
        username: null,
        accesstokenserver: null,
        accesstokenlocal: null,
        loggedin: false
      });
      console.log("logged out.");
    }.bind(this));
  },
  hideAll: function() {
    this.setState({
      showList: false,
      showCreateNew: false,
      showPollDetails: false,
      showMyPolls: false
    })
  },
  setGlobalList: function(result) {
    this.setState({
      globalList: {result}
    })
  },
  returnToHomeView: function() {
    this.hideAll();
    this.setState({
      showList: true,
    })
  },
  handleCreateNewClick: function() {
    this.hideAll();
    this.setState({
      showCreateNew: true
    });
  },
  handleVoteClick: function(questionId, option) {
    // Request to server to add a vote
    var params = "id=" + questionId + "&answer=" + encodeURI(option) + "&userid=" + this.state.username;
    console.log("Sending params: " + params);
    this.serverRequest = $.getJSON('/api/votepoll?'+params, function (result) {
      // On vote success: show confirmation?
      // On vote failure: You have already voted on this poll
      console.log(result);
      if (result.hasOwnProperty("ERROR")) {
        alert('A user from your ip has already voted on this poll');
      } else if (result.hasOwnProperty("message")) {
        // Set message and toggle showpolldetails off/on to redraw component
        // *** just a workaround
        this.setGlobalList(result.message);
        this.setState({
          pollTarget: result.message.reduce(function(acc, entry) {
            if (entry._id === questionId) {
              return entry;
            }
          })
        });
      }
    }.bind(this));
    // this.setState({showCreateNew: false});
  },
  handleSubmitNewClick: function(question, answers) {
    // submit question, answer1 and answer2 to the server.
    // Implement a check for EMPTY question, answer1, or answer2
    console.log(answers);
    var answerParam = '';
    answers.forEach(function(answer) {
      answerParam = answerParam.concat("&answer="+answer);
    });
    var params = "question=" + question + answerParam + "&userid=" + this.state.username;
    this.serverRequest = $.getJSON('/api/createpoll?'+params, function (result) {
      this.setState({globalList: result.message, showCreateNew: false, showList: true});
    }.bind(this));
  },
  handleSelectPoll: function(pollObject) {
    console.log(JSON.stringify(pollObject));
    this.hideAll();
    this.setState({
      pollTarget: pollObject,
      showPollDetails: true
    })
  },
  handleDeleteClick: function(questionId) {
    var params = "id=" + questionId + "&userid=" + this.state.username;
    this.serverRequest = $.getJSON('/api/deletepoll?'+params, function (result) {
      console.log(result);
      this.hideAll();
      this.setState({
        showList: true
      });
    }.bind(this));
  },
  handleLogin: function() {
    this.serverRequest = $.getJSON(host+'/api/login', function (result) {
      console.log(result);
    })
  },
  showMyPolls: function() {
    this.hideAll();
    this.setState({
      showMyPolls: true
    })
  },
  render: function() {
    return (<div>
    <nav className="navbar navbar-toggleable-md navbar-dark bg-primary">
        <div className="container">
            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav1" aria-controls="navbarNav1" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" onClick={this.returnToHomeView}>
                <strong>Voting App</strong>
            </a>
            <div className="collapse navbar-collapse" id="navbarNav1">
                <ul className="navbar-nav mr-auto">
                </ul>
                <DropdownComponent loggedin={this.state.loggedin} username={this.state.username} logoutfunc={this.logout} mypollsfunc={this.showMyPolls} newpollfunc={this.handleCreateNewClick}/>
            </div>
        </div>
    </nav>
      {this.state.showList? <ListArea user={this.state.username} selectPoll={this.handleSelectPoll} setGlobalList={this.setGlobalList}/> : null}
      {this.state.showCreateNew && !this.state.showList?<CreateNewArea displayfunc={this.handleSubmitNewClick}/> : null}
      {this.state.showPollDetails && !this.state.showList?<PollDetailsArea username={this.state.username} content={this.state.pollTarget} voteClick={this.handleVoteClick} deleteClick={this.handleDeleteClick}/> : null}
      {this.state.showMyPolls && !this.state.showList?<MyPolls user={this.state.username} globalList={this.state.globalList} selectPoll={this.handleSelectPoll}/>:null}
      </div>);
  }
});
