import React from "react";
import R from "ramda";

import VictoryChart from "./Chart/VictoryChart.jsx";
import Modal from "./Modal/Modal.jsx";

import {
  initialScores, TEAM1, TEAM2, getTotalScore, addScore
} from "../types/scores.js";

const teamClass = (teamId) => {
  return {
    [TEAM1]: "team--1",
    [TEAM2]: "team--2"
  }[teamId];
};

export default class App extends React.Component {

  state = {
    scores: initialScores,
    scoringTeam: null // null or teamId
  }

  enterScore = (scoringTeam) => {
    this.setState({ scoringTeam });
  }

  closeModal = () => {
    this.setState({ scoringTeam: null });
  }

  scoreForTeam = (n) => {
    const { scoringTeam, scores } = this.state;

    this.setState({
      scores: addScore(scoringTeam, n, scores),
      scoringTeam: null
    });
  }

  renderScoreBtn = (i) => {
    return (
      <div key={i} className="score-input__btn" onClick={() => this.scoreForTeam(i+1)}>
        {i + 1}
      </div>
    );
  }

  render = () => {

    const { scores, scoringTeam } = this.state;

    const modalTitle = (
      <div className="score-input__title">
        Score for
        <div className={`score-input__color team__color ${teamClass(scoringTeam)}`}></div>
      </div>
    );

    return (
      <div className="container">
        <VictoryChart {...{ scores }} />

        <div className="teams">
          <div className="team" onClick={() => this.enterScore(TEAM1)}>
            <div className="team__color team--1"></div>
            {getTotalScore(TEAM1, scores)}
          </div>
          <div className="team" onClick={() => this.enterScore(TEAM2)}>
            <div className="team__color team--2"></div>
            {getTotalScore(TEAM2, scores)}
          </div>
        </div>

        <Modal isOpen={scoringTeam !== null} onClose={this.closeModal} title={modalTitle}>
          <div className="score-input">
            <div className="score-input__btns">
              {R.range(0, 12).map(this.renderScoreBtn)}
            </div>
          </div>
        </Modal>
      </div>
    );
  };

}
