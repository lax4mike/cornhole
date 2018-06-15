import React from "react";
import classNames from "classnames";
import { arrayOf, func, oneOf } from "prop-types";

import { TEAM1, TEAM2, getTotalScoreFor, scoreShape } from "../../types/scores.js";


const propTypes = {
  scores: arrayOf(scoreShape).isRequired,
  enterScore: func.isRequired,
  scoreNone: func.isRequired,
  winner: oneOf([TEAM1, TEAM2, null])
};

const Scores = (props) => {

  const { scores, enterScore, scoreNone, winner } = props;

  const winnerText = <div className="winner">Winner!</div>;

  return (
    <React.Fragment>
      <div className={classNames("teams", { "has-winner": winner})}>
        <div className="team team--1" onClick={() => !winner && enterScore(TEAM1)}>
          <div className="team__color"></div>
          {getTotalScoreFor(TEAM1, scores)}
          {winner === TEAM1 && winnerText}
        </div>

        {!winner && (
          <div className="btn" onClick={() => !winner && scoreNone()}>
            <div className="btn__text">no score</div>
          </div>
        )}

        <div className="team team--2" onClick={() => !winner && enterScore(TEAM2)}>
          <div className="team__color"></div>
          {getTotalScoreFor(TEAM2, scores)}
          {winner === TEAM2 && winnerText}
        </div>
      </div>

    </React.Fragment>

  );
};

Scores.propTypes = propTypes;
export default Scores;
