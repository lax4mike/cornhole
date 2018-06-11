import React from "react";
import classNames from "classnames";
import { func } from "prop-types";

import { TEAM1, TEAM2, getTotalScore, scoresShape } from "../../types/scores.js";


const propTypes = {
  scores: scoresShape.isRequired,
  enterScore: func.isRequired,
  scoreNone: func.isRequired,
  resetScores: func.isRequired
};

const Scores = (props) => {

  const { scores, enterScore, scoreNone, resetScores } = props;

  const hasWon = (teamId) => getTotalScore(scores[teamId]) === 21;

  const winner =
    (hasWon(TEAM1)) ? TEAM1 :
    (hasWon(TEAM2)) ? TEAM2 :
    null;

  const winnerText = <div className="winner">Winner!</div>;

  return (
    <React.Fragment>
      <div className={classNames("teams", { "has-winner": winner})}>
        <div className="team" onClick={() => !winner && enterScore(TEAM1)}>
          <div className="team__color team--1"></div>
          {getTotalScore(scores[TEAM1])}
          {winner === TEAM1 && winnerText}
        </div>

        {!winner && (
          <div className="team" onClick={() => !winner && scoreNone()}>
            <div className="team__color team--none">no score</div>
          </div>
        )}

        <div className="team" onClick={() => !winner && enterScore(TEAM2)}>
          <div className="team__color team--2"></div>
          {getTotalScore(scores[TEAM2])}
          {winner === TEAM2 && winnerText}
        </div>
      </div>

      {winner && (
        <div className="btn" onClick={() => resetScores()}>
          <div className="btn__text">reset</div>
        </div>
      )}
    </React.Fragment>

  );
};

Scores.propTypes = propTypes;
export default Scores;
