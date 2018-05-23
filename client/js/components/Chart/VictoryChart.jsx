import React from "react";

import { VictoryChart, VictoryLine } from "victory";
import { getTotalScores } from "../../types/scores.js";

import { scoresShape } from "../../types/scores.js";

export default class Chart extends React.Component  {

  static propTypes = {
    scores: scoresShape.isRequired
  };


  render = () => {

    const { scores } = this.props;


    return (
      <div className="chart">
        <VictoryChart
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
          domain={{
            x: [0, scores.team1.length],
            y: [0, 21]
          }}
        >
          <VictoryLine data={getTotalScores(scores.team1)}
            style={{ data: { stroke: "#8e44ad", strokeWidth: 2, strokeLinecap: "round" } }}
          />
          <VictoryLine data={getTotalScores(scores.team2)}
            style={{ data: { stroke: "#e67e22", strokeWidth: 2, strokeLinecap: "round" } }}
          />

        </VictoryChart>

      </div>
    );
  };

}
