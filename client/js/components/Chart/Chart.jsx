import R from "ramda";
import React from "react";
import createD3Chart from "./d3Chart.js";
import debounce from "lodash.debounce";

import { scoresShape } from "../../types/scores.js";



export default class Chart extends React.Component {

  static propTypes = {
    scores: scoresShape
  }

  componentDidMount = () => {
    const { width, height } = this.calculateDimensions();

    this.d3Chart = createD3Chart({
      el: this.d3Mount.current,
      scores: this.props.scores,
      width, height
    });

    window.addEventListener("resize", this.resizeToFill);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeToFill);
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {

    // only update the viz if the scores have changed
    if (prevProps.scores !== this.props.scores){
      this.d3Chart.setState(this.props);
    }
  }

  resizeToFill = debounce(() => {

    const { width, height } = this.calculateDimensions();

    this.d3Chart.setState({ width, height });

  }, 100)

  calculateDimensions = () => {
    const { clientWidth } = this.d3Mount.current.parentNode;

    const width = R.min(clientWidth, 700);
    const height = R.max(width * (1/2), 300);

    return { width, height };
  }


  d3Mount = React.createRef()

  render = () => {
    return (
      <div className="js-chart" ref={this.d3Mount}></div>
    );
  }
}
