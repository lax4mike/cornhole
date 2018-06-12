import React from "react";
import classNames from "classnames";
import { func, number } from "prop-types";
import { scoresShape, getRoundScores } from "../../types/scores.js";

export default class History extends React.Component {

  static propTypes = {
    scores: scoresShape.isRequired,
    onScoreHover: func,
    selectedScore: number
  }

  handleClick = i => e => {
    const { onScoreHover } = this.props;
    onScoreHover && onScoreHover(i);
  }

  render = () => {

    const { scores, selectedScore } = this.props;

    const history = getRoundScores(scores);

    return (
      <div className="history">
        {history.map((score, i) => {
          const classes = classNames(
            "history__score",
            score ? score.team : "no-score",
            {
              "is-selected": selectedScore === i
            }
          );
          return (
            <div key={i} className={classes} onClick={this.handleClick(i)}>
              <div className="history__dot" />
              {score && score.score}
            </div>
          );
        })}
      </div>
    );
  }

}
