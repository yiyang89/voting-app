import React from "react";

class PollDetailsArea extends React.Component {
  // Poll details receives props.content, props.voteClick(option), and props.newOption(option) on construction
  constructor(props) {
    super(props);

    this.handleChangeCustom = this.handleChangeCustom.bind(this);

    this.state = {
      customOption: null
    }
  }

  handleChangeCustom(event) {
    this.setState({customOption: event.target.value})
  }

  render() {
    // Box should contain a form for voting on a poll, and display existing poll stats
    var disabledFlag = false;
    var selected = null;
    this.props.content.voted.forEach(function(entry) {
      if (entry.user_id === this.props.username) {
        disabledFlag = true;
        selected = entry.answer;
      }
    }.bind(this));
    var output = this.props.content.answers.map(function(data, i) {
      var classSet = disabledFlag && data === selected? "btn btn-primary btn-wide" : "btn btn-info btn-wide";
      return <button className={classSet} key={i} onClick={this.props.voteClick.bind(null, this.props.content._id, data)} disabled={disabledFlag}>{data}</button>
    }, this);
    var deleteDisplay = this.props.content.creator_id === this.props.username? <button className="btn btn-danger btn-wide" onClick={this.props.deleteClick.bind(null, this.props.content._id)}>Delete this poll</button> : null;
    var newOptionDisplay = this.props.username? <input className="inputBox" type="text" placeholder="Don't like these options? Add your own!" onChange={this.handleChangeCustom}/> : null;
    var url = "http://voting-app-decky.herokuapp.com/api/poll/"+this.props.content._id;
    var shareDisplay = this.props.username? <div type="text">{url}</div> : null;
    return (<div className="contentBox">
    <div className="paddedText head windowHeading" >{this.props.content.question}</div>
    <div className="boxContent grid-by-rows">
    {output}
    {disabledFlag? null : newOptionDisplay}
    {this.state.customOption?<button className="btn btn-info btn-wide" onClick={this.props.voteClick.bind(null, this.props.content._id, this.state.customOption)}>{this.state.customOption}</button> : <div/>}
    <div id="chart_div"><GoogleDonut data={this.props.content.voted} target="chart_div"/></div>
    {shareDisplay}
    {deleteDisplay}
    </div>
    </div>)
  }
}

class GoogleDonut extends React.Component {
  constructor(props) {
    super(props);

    this._handleWindowResize = this._handleWindowResize.bind(this);
    this.drawCharts = this.drawCharts.bind(this);
  }

  componentDidMount() {
    google.charts.load("visualization", "1", {packages:["corechart"]});
    google.charts.setOnLoadCallback(this.drawCharts);
    window.addEventListener('resize', this._handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleWindowResize);
  }

  componentDidUpdate() {
    this.drawCharts();
  }

  _handleWindowResize() {
    this.drawCharts();
  }

  drawCharts() {
    // Process the voted array.
    var stepOneArray = [];
    this.props.data.forEach(function (entry) {
      if (!stepOneArray.includes(entry)) {stepOneArray.push(entry.answer)}
    })
    var counts = {};
    var i;
    var value;
    for (i = 0; i < stepOneArray.length; i++) {
      value = stepOneArray[i];
      if (typeof counts[value] === "undefined") {
        counts[value] = 1;
      } else {
        counts[value]++;
      }
    }
    var processedData = [];
    Object.keys(counts).forEach(function(key) {
      processedData.push([key, counts[key]]);
    });
    // Create the data table.
    // data.addColumn('string', 'Topping');
    // console.log(JSON.stringify(google));
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Option');
    data.addColumn('number', 'Votes');
    data.addRows(
      processedData
    );
    // Set chart options
    var options = {
      'pieHole':0.4,
      'pieSliceBorderColor':"#eeeeee"
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById(this.props.target));
    chart.draw(data, options);
  }

  render() {
    // google.charts.setOnLoadCallback(drawChart.bind(this));
    return null;
  }
}

export default PollDetailsArea;
