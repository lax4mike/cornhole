import React from "react";
import d3Chart from "./d3Chart.js";


import { arrayOf, number, shape } from "prop-types";



export default class Chart extends React.Component {

  static propTypes = {
    scores: shape({
      team1: arrayOf(number).isRequired,
      team2: arrayOf(number).isRequired
    })
  }

  container = React.createRef()

  componentDidMount = () => {
    d3Chart.create({
      el: this.container.current,
      scores: this.props.scores
    });
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {

    d3Chart.update(this.props);
  }

  render = () => {
    return (
      <div className="js-chart" style={{ width: 400, height: 300 }} ref={this.container}></div>
    );
  }
}
