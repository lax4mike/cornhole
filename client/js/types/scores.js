import R from "ramda";
import { arrayOf, number, shape } from "prop-types";

export const TEAM1 = "team1";
export const TEAM2 = "team2";


export const scoresShape = shape({
  team1: arrayOf(number).isRequired,
  team2: arrayOf(number).isRequired
});

// Scores
export const initialScores = {
  [TEAM1]: [],
  [TEAM2]: []
};


// addScore ::  Number -> Number -> Scores
export const addScore = R.curry((teamId, score, scores) => {
  return R.compose(
    R.evolve({
      [TEAM1]: R.append(teamId === TEAM1 ? score : 0),
      [TEAM2]: R.append(teamId === TEAM2 ? score : 0)
    })
  )(scores);
});

// paritally applied
export const scoreTeam1 = addScore(TEAM1);
export const scoreTeam2 = addScore(TEAM2);
export const scoreNone = addScore(null, null);

const scoreReducer = (tally, n) => {
  // if it goes over 21, back to 11!
  return R.when(R.gt(R.__, 21), () => 11)(tally + n);
};


// getTotalScore :: String -> Scores -> Number
export const getTotalScore = (teamId, scores) =>
  R.compose(
    R.reduce(scoreReducer, 0),
    R.prop(teamId)
  )(scores);

// getTotalScores :: String -> [Scores] -> [Number]
export const getTotalScores = (scores) =>
  R.scan(scoreReducer, 0)(scores);



// const score1 = scoreTeam1(5, initialScores);
// // console.log(score1);
// const score2 = scoreTeam2(10, score1);
// // console.log(score2);
// const score3 = scoreTeam1(3, score2);
// console.log(score3);
// console.log(getTotalScores(TEAM1, score3));
