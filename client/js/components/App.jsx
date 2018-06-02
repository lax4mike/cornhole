import React from "react";
import R from "ramda";
import { func } from "prop-types";

import Chart from "./Chart/Chart.jsx";
import Modal from "./Modal/Modal.jsx";

import {
  TEAM1, TEAM2, getTotalScore, addScore, scoreNone, scoresShape
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

  renderScoreBtn = (i) => {
    return (
      <div key={i} className="score-input__btn" onClick={() => this.scoreForTeam(i+1)}>
        {i + 1}
      </div>
    );
  }

  render = () => {

    const { scores } = this.props;
    const { scoringTeam } = this.state;

    const modalTitle = (
      <div className="score-input__title">
        Score for
        <div className={`score-input__color team__color ${teamClass(scoringTeam)}`}></div>
      </div>
    );

    return (
      <div className="container">
        <Chart {...{ scores }} />

        <div className="teams">
          <div className="team" onClick={() => this.enterScore(TEAM1)}>
            <div className="team__color team--1"></div>
            {getTotalScore(TEAM1, scores)}
          </div>
          <div className="team" onClick={this.scoreNone}>
            <div className="team__color team--none">no score</div>
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
