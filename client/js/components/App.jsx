import React from "react";
import R from "ramda";
import { array, func } from "prop-types";
import classNames from "classnames";

import Chart from "./Chart/Chart.jsx";
import History from "./History/History.jsx";
import Scores from "./Scores/Scores.jsx";
import Modal from "./Modal/Modal.jsx";

import {
  TEAM1, TEAM2, scoreTeam, scoreNone, initialScores
} from "../types/scores.js";

const teamClass = (teamId) => {
  return {
    [TEAM1]: "team--1",
    [TEAM2]: "team--2"
  }[teamId];
};


export default class App extends React.Component {

  static propTypes = {
    scores: array.isRequired,
    onScore: func.isRequired
  }

  state = {
    scoringTeam: null, // null or teamId
    selectedScore: null
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

    onScore(scoreTeam(scoringTeam, n, scores));

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

  handleScoreSelect = (index) => {
    this.setState({ selectedScore: index });
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
    const { scoringTeam, selectedScore } = this.state;

    const modalTitle = (
      <div className="score-input__title">
        Score for
        <div className={classNames(
          "score-input__color", "team__color", teamClass(scoringTeam)
        )} />
      </div>
    );


    return (
      <div className="app">

        <h2>Cornhole!</h2>

        <div className="app__chart">
          <Chart
            scores={scores}
            selectedScore={selectedScore}
          />
        </div>

        <div className="app__scores">
          <Scores
            scores={scores}
            enterScore={this.enterScore}
            scoreNone={this.scoreNone}
            resetScores={this.resetScores}
          />
        </div>


        <div className="app__history">
          <History
            scores={scores}
            onScoreHover={this.handleScoreSelect}
            selectedScore={selectedScore}
          />
        </div>


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
