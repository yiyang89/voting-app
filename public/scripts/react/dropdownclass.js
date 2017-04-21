var DropdownComponent = React.createClass({
  render: function() {
    // Login is a single item
    // If logged in, display dropdown.
    var dropdown;
    if (this.props.username) {
      // <a className="dropdown-item" onClick={this.logout}>Logout</a>
      // <a className="dropdown-item" href="/auth/google">Google+ Login</a>
      dropdown = (
        <li className="nav-item dropdown btn-group">
            <a className="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.username}</a>
            <div className="dropdown-menu dropdown" aria-labelledby="dropdownMenu1">
              <a className="dropdown-item" onClick={this.props.newpollfunc}>Create New</a>
              <a className="dropdown-item" onClick={this.props.mypollsfunc}>My Polls</a>
              <a className="dropdown-item" onClick={this.props.logoutfunc}>Logout</a>
            </div>
        </li>
      );
    } else {
      dropdown = (
        <a className="nav-link" href="/auth/google">Google+</a>
      );
    }
    return dropdown;
  }
})
