var LoginArea = React.createClass({
  render: function() {
    // Return either a button or a welcome message based on global being set.
    if (user) {
      return <p> Welcome [USERNAME GOES HERE]! </p>;
    } else {
      return (<div className="login">
      <button onClick={processLogin} id="loginButton" className="btn btn-primary waves-effect waves-light loginbtn">
      Google Login
      </button>
      </div>);
    }
  }
});