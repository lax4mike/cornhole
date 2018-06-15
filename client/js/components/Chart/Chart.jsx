import R from "ramda";
import React from "react";
import createD3Chart from "./d3Chart.js";
import debounce from "lodash.debounce";

import { arrayOf, number } from "prop-types";
import { scoreShape } from "../../types/scores.js";


export default class Chart extends React.Component {

  static propTypes = {
    scores: arrayOf(scoreShape).isRequired,
    selectedScore: number
  }

  componentDidMount = () => {
    const { selectedScore, scores } = this.props;
    const { width, height } = this.calculateDimensions();

    this.d3Chart = createD3Chart({
      el: this.d3Mount.current,
      scores,
      width,
      height,
      selectedScore
    });

    window.addEventListener("resize", this.resizeToFill);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeToFill);
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {

    const changed = key => prevProps[key] !== this.props[key];

    // only update the viz if the props have changed
    if (changed("scores") || changed("selectedScore")){
      this.d3Chart.setState(this.props);
    }
  }

  resizeToFill = debounce(() => {

    const { width, height } = this.calculateDimensions();

    this.d3Chart.setState({ width, height });

  }, 100)

  calculateDimensions = () => {
    const { clientWidth } = this.d3Mount.current;

    const width = clientWidth;
    const height = R.max(clientWidth * (1/2), 300);

    return { width, height };
  }


  d3Mount = React.createRef()

  render = () => {
    return (
      <div className="js-chart chart" ref={this.d3Mount}></div>
    );
  }
}
