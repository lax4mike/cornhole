import React from "react";
import R from "ramda";
import { func } from "prop-types";
import classNames from "classnames";

import Chart from "./Chart/Chart.jsx";
import Modal from "./Modal/Modal.jsx";

import {
  TEAM1, TEAM2, getTotalScore, addScore, scoreNone, scoresShape, initialScores
} from "../types/scores.js";

const teamClass = (teamId) => {
  return {
    [TEAM1]: "team--1",
    [TEAM2]: "team--2"
  }[teamId];
};


export default class App extends React.Component {

  static propTypes = {
    scores: scoresShape.isRequired,
    onScore: func.isRequired
  }

  state = {
    scoringTeam: null // null or teamId
  }

  enterScore = (scoringTeam) => {
    this.setState({ scoringTeam });
  }

  closeModal = () => {
    this.setState({ scoringTeam: null });
  }

  scoreForTeam = (n) => {
    const { scoringTeam } = this.state;
    const { onScore, scores  } = this.props;

    onScore(addScore(scoringTeam, n, scores));

    this.setState({
      scoringTeam: null
    });
  }

  scoreNone = () => {
    const { scores, onScore } = this.props;

    onScore(scoreNone(scores));

    this.setState({
      scoringTeam: null
    });
  }

  resetScores = () => {
    const { onScore } = this.props;

    onScore(initialScores);
  }

  // score buttons in modal
  renderScoreBtn = (i) => {
    return (
      <div key={i} className="score-input__btn"
        onClick={() => this.scoreForTeam(i)}
      >
        {i}
      </div>
    );
  }

  render = () => {

    const { scores } = this.props;
    const { scoringTeam } = this.state;

    const modalTitle = (
      <div className="score-input__title">
        Score for
        <div className={classNames(
          "score-input__color", "team__color", teamClass(scoringTeam)
        )} />
      </div>
    );

    const hasWon = (teamId) => getTotalScore(scores[teamId]) === 21;

    const winner =
      (hasWon(TEAM1)) ? TEAM1 :
      (hasWon(TEAM2)) ? TEAM2 :
      null;

    const winnerText = <div className="winner">Winner!</div>;

    return (
      <div className="container">

        <Chart {...{ scores }} />

        <div className={classNames("teams", { "has-winner": winner})}>
          <div className="team" onClick={() => !winner && this.enterScore(TEAM1)}>
            <div className="team__color team--1"></div>
            {getTotalScore(scores[TEAM1])}
            {winner === TEAM1 && winnerText}
          </div>

          {!winner && (
            <div className="team" onClick={() => !winner && this.scoreNone()}>
              <div className="team__color team--none">no score</div>
            </div>
          )}

          <div className="team" onClick={() => !winner && this.enterScore(TEAM2)}>
            <div className="team__color team--2"></div>
            {getTotalScore(scores[TEAM2])}
            {winner === TEAM2 && winnerText}
          </div>
        </div>

        {winner && (
          <div className="btn" onClick={() => this.resetScores()}>
            <div className="btn__text">reset</div>
          </div>
        )}

        <Modal isOpen={scoringTeam !== null} onClose={this.closeModal} title={modalTitle}>
          <div className="score-input">
            <div className="score-input__btns">
              {R.range(1, 13).map(this.renderScoreBtn)}
            </div>
          </div>
        </Modal>
      </div>
    );
  };

}
