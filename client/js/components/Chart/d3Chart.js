import R from "ramda";
import { select } from "d3-select";


let state = {};

function setState(newState){

  state = R.merge(state, newState);

  api.update(newState);
}

function validateProp(name, props){
  if (!props[name]){
    console.error(`missing ${name}!`, props);
    return false;
  }
  return true;
}


const api =  {

  create: (props) => {

    if (!R.all(validateProp, ["el", "data"])){
      return;
    }

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


    const xAxis = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0, ${height})`);

    const yAxis = g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", `translate(0, 0)`);

    setState({
      container,
      dimensions,
      width,
      height,
      margin,
      xAxis,
      yAxis,
      ...props
    });

    return this;

  },

  update: (props) => {
    // const xScale = scaleBand()
    //   .domain(cleanBarData.map((d, i) => i))
    //   .rangeRound([ 0, width ])
    //   .padding(0.25);
    //
    // const yScale = scaleLinear()
    //   .domain([0, 5]) // 5 instead of 4 for padding
    //   .rangeRound([ height, 0 ]);
    //
    //   xAxis.call(
    //   axisBottom(xScale)
    //     .tickFormat(d => d)
    //     .tickSize(0)
    //     .tickPadding(8)
    // );
  }
};


export default api;
