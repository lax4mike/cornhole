import R from "ramda";
import { select } from "d3-selection";
import { line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import "d3-transition";

import { getTotalScores, TEAM1, TEAM2 } from "../../types/scores.js";


let state = {};

function setState(newState){

  state = R.merge(state, newState);

  render(newState);
}

const validateProp = R.curry((props, name) => {
  if (!props[name]){
    console.error(`missing ${name}!`, props);
    return false;
  }
  return true;
});


const api =  {

  create: (props) => {

    if (!R.all(validateProp(props), ["el", "scores"])){
      return;
    }

    init(props);

    return this;
  },

  update: (props) => {
    setState(props);

    return this;
  }
};

function init(props){
  const { el } = props;

  const container = select(el);
  const dimensions = el.getBoundingClientRect();

  const svg = container.append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .attr("class", "bar");

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g.append("path")
    .attr("class", "team1-path")
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5);

  g.append("path")
    .attr("class", "team2-path")
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${height})`);

  g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(0, 0)");

  setState({
    g,
    width,
    height,
    ...props
  });
}


function render() {
  const { width, height, g, scores } = state;

  const xScale = scaleLinear()
    .domain([0, scores.team1.length])
    .rangeRound([0, width]);

  const yScale = scaleLinear()
    .domain([0, 21])
    .range([height, 0]);

  const lineGenerator = line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d));

  g.select(".team1-path")
    .transition()
    .duration(1000)
    .attr("d", lineGenerator(getTotalScores(scores[TEAM1])));

  g.select(".team2-path")
    .transition()
    .duration(1000)
    .attr("d", lineGenerator(getTotalScores(scores[TEAM2])));


  g.select(".axis--x")
    .call(axisBottom(xScale));

  g.select(".axis--y")
    .call(
      axisLeft(yScale)
        .ticks(21)
    );
}


export default api;
