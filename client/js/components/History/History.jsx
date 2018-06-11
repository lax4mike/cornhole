import React from "react";

import classNames from "classnames";
import { scoresShape, getRoundScores } from "../../types/scores.js";

export default class History extends React.Component {

  static propTypes = {
    scores: scoresShape.isRequired
  }

  render = () => {

    const { scores } = this.props;

    const history = getRoundScores(scores);

    return (
      <div className="history">
        {history.map((score, i) => {
          return (
            <div key={i} className={classNames("history__score",
              score ? score.team : "no-score"
            )}>
              <div className="history__dot" />
              {score && score.score}
            </div>
          );
        })}
      </div>
    );
  }

}
