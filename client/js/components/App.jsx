import React from "react";
import R from "ramda";
import { array, func } from "prop-types";
import classNames from "classnames";


import Chart from "./Chart/Chart.jsx";
import History from "./History/History.jsx";
import Scores from "./Scores/Scores.jsx";
import Modal from "./Modal/Modal.jsx";

import {
  TEAM1, TEAM2, scoreTeam, scoreNone, initialScores, getTotalScoreFor
} from "../types/scores.js";

const teamClass = (teamId) => {
  return {
    [TEAM1]: "team--1",
    [TEAM2]: "team--2"
  }[teamId];
};

const horn = new Audio("img/rasta.mp3");

function playHorn(){
  horn.pause();
  horn.currentTime = 0;
  horn.play();
}


export default class App extends React.Component {

  static propTypes = {
    scores: array.isRequired,
    onScore: func.isRequired
  }

  static getDerivedStateFromProps = (props, state) => {
    const { scores } = props;

    const hasWon = (teamId) => getTotalScoreFor(teamId, scores) === 21;

    const winner =
      (hasWon(TEAM1)) ? TEAM1 :
      (hasWon(TEAM2)) ? TEAM2 :
      null;

    return { winner };
  }

  state = {
    resetModalOpen: false,
    scoringTeam: null, // null or teamId
    selectedScore: null,
    winner: null
  }

  componentDidMount = () => {
    this.checkForWinner({}, this.state);
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.checkForWinner(prevState, this.state);
  }

  checkForWinner = (prev, state) => {

    const { winner } = state;

    // if the winner was null, and now we have a winner, FANFARE!!
    if (R.isNil(prev.winner) && !R.isNil(winner)) {
      setTimeout(playHorn, 4624 - 4624);
      setTimeout(playHorn, 6016 - 4624);
      setTimeout(playHorn, 6242 - 4624);
      setTimeout(playHorn, 6496 - 4624);
      setTimeout(playHorn, 6689 - 4624);
    }

    document.querySelector("body").classList.toggle("winner-team1", winner === TEAM1);
    document.querySelector("body").classList.toggle("winner-team2", winner === TEAM2);
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

  handleNewGameClick = (e) => {
    const { winner } = this.state;

    // show the modal if there is no winner yet
    if (!winner){
      this.setState({ resetModalOpen: true });
    }
    else {
      this.resetScores();
    }
  }


  resetScores = () => {
    const { onScore } = this.props;

    onScore(initialScores);

    this.setState({ resetModalOpen: false });
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
    const { scoringTeam, selectedScore, winner, resetModalOpen } = this.state;

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

        <div className="app__scores app__container">
          <Scores
            scores={scores}
            winner={winner}
            enterScore={this.enterScore}
            scoreNone={this.scoreNone}
          />
        </div>


        {/* <div className="app__history">
          <History
            scores={scores}
            onScoreHover={this.handleScoreSelect}
            selectedScore={selectedScore}
          />
        </div> */}

        <div className="app__toolbar">
          <div className="app__container">
            <div className="btn" onClick={this.handleNewGameClick}>
              <div className="btn__text">new game</div>
            </div>
          </div>
        </div>

        <Modal isOpen={resetModalOpen} onClose={(e) => this.setState({ resetModalOpen: false })} title="Are you sure??">

          <p>This will set this game scores back to zero!</p>

          <div className="modal__confirm-btns">
            <div className="btn" onClick={(e) => this.setState({ resetModalOpen: false })}>
              <div className="btn__text">cancel</div>
            </div>
            <div className="btn btn--red" onClick={this.resetScores}>
              <div className="btn__text">reset game</div>
            </div>
          </div>
        </Modal>


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
