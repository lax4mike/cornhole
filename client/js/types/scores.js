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


// common reducer for getTotalScore(s)
const scoreReducer = (tally, n) => {
  // if it goes over 21, back to 11!
  return R.when(R.gt(R.__, 21), () => 11)(tally + n);
};


// given an array of a score for each round, tally the final score
// getTotalScore :: [Number] -> Number
export const getTotalScore = (scores) =>
  R.reduce(scoreReducer, 0)(scores);


// given an array of a score for each round, return an array of the
// total score for each round
// getTotalScores :: [Number] -> [Number]
export const getTotalScores = (scores) =>
  R.scan(scoreReducer, 0)(scores);


// getRoundScores :: Scores -> [{ team, score }]
export const getRoundScores = (bothScores) => {
  return R.range(0, bothScores[TEAM1].length).map(i => {
    const team1Score = bothScores[TEAM1][i];
    const team2Score = bothScores[TEAM2][i];
    if (team1Score !== 0){
      return { team: TEAM1, score: team1Score };
    }
    else if (team2Score !== 0){
      return { team: TEAM2, score: team2Score };
    }
    else {
      return null;
    }
  });
};
