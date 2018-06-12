import R from "ramda";
import { select } from "d3-selection";
import { line, curveStepBefore, curveStepAfter } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { checkPropTypes, object } from "prop-types";
import { scoresShape } from "../../types/scores.js";
import "d3-transition";

import { getTotalScores, TEAM1, TEAM2 } from "../../types/scores.js";

export default function createChart(props) {


  let state = {
    margin: { top: 20, right: 20, bottom: 40, left: 40 }
  };

  function setState(newState){

    state = R.merge(state, newState);

    render(state);
  }

  init(props);

  // called once
  function init(props){

    checkPropTypes({
      el: object.isRequired,
      scores: scoresShape.isRequired
    }, props, "prop", "d3Chart");

    const { el } = props;
    const { margin } = state;

    const container = select(el);

    const svg = container.append("svg");

    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
      .attr("class", "chart__axis chart__x-axis");

    g.append("g")
      .attr("class", "chart__axis chart__y-axis");

    [TEAM1, TEAM2].forEach(teamId => {
      g.append("g")
        .attr("class", `chart__${teamId}`)
        .append("path")
        .attr("class", "chart__path")
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3);
    });


    setState({
      g,
      width,
      height,
      ...props
    });
  }


  function renderLine(teamId, { xScale, yScale }) {

    const { g, scores } = state;

    const lineGenerator = line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(curveStepAfter);

    const teamTotalScores = getTotalScores(scores[teamId]);

    g.select(`.chart__${teamId} .chart__path`)
      .transition()
      .duration(250)
      .attr("d", lineGenerator(teamTotalScores));

    // const dots = g.select(`.chart__${teamId}`)
    //   .selectAll(".chart__dot")
    //   .data(teamTotalScores, (d, i) => i);
    //
    // const dotsEnter = dots.enter()
    //   .append("circle")
    //   .attr("class", "chart__dot")
    //   .attr("r", 5)
    //   .attr("cx", (d, i) => xScale(i))
    //   .attr("cy", (d, i) => yScale(d));
    //
    // dotsEnter.merge(dots)
    //   .attr("cx", (d, i) => xScale(i))
    //   .attr("cy", (d, i) => yScale(d));
    //
    // dots.exit().remove();
  }

  function render() {
    const { g, scores, el } = state;
    const { width, height } = getVizStyles(state);

    select(el).select("svg")
      .attr("width", state.width)
      .attr("height", state.height);

    const xScale = scaleLinear()
      .domain([ 0, R.max(scores[TEAM1].length, 8) ])
      .rangeRound([ 0, width ]);

    const yScale = scaleLinear()
      .domain([ 0, 21 ])
      .range([ height, 0 ]);


    renderLine(TEAM1, { xScale, yScale });
    renderLine(TEAM2, { xScale, yScale });

    const rounds = xScale.domain()[1];

    g.select(".chart__x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(
        axisBottom(xScale)
          .tickFormat((d, i) => i === 0 ? "" : i)
          .tickPadding(10)
          .ticks(rounds > 10 ? 10 : rounds)
      );

    g.select(".chart__y-axis")
      .attr("transform", "translate(0, 0)")
      .call(
        axisLeft(yScale)
          .tickPadding(10)
          .tickSizeInner(-1 * width)
          .ticks(21)
      );

    g.selectAll(".chart__y-axis .tick")
      .classed("is-hidden", d => (d !== 11 && d !== 21));
  }


  return { setState };
}


/*
 * NOTE! transform needs to be:
 *   - an attribute on SVG elements
 *   - a style on HTML elements
 * There are bugs with Firefox and IE when using style instead of attr on svgs!
 * see https://github.com/d3/d3/issues/2771
 */
export function getVizStyles({ width, height, margin }){
  return {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
    transformAttr: `translate(${margin.left}, ${margin.top})`,
    transformStyle: `translate(${margin.left}px, ${margin.top}px)`
  };
}
