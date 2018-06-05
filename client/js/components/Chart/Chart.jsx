import React from "react";
import createD3Chart from "./d3Chart.js";


import { arrayOf, number, shape } from "prop-types";



export default class Chart extends React.Component {

  static propTypes = {
    scores: shape({
      team1: arrayOf(number).isRequired,
      team2: arrayOf(number).isRequired
    })
  }


  componentDidMount = () => {
    this.d3Chart = createD3Chart({
      el: this.container.current,
      scores: this.props.scores
    });
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {

    // only update the viz if the scores have changed
    if (prevProps.scores !== this.props.scores){
      this.d3Chart.setState(this.props);
    }

  }


  container = React.createRef()

  render = () => {
    return (
      <div className="js-chart" style={{ width: 400, height: 300 }} ref={this.container}></div>
    );
  }
}
