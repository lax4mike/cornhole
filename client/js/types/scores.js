import R from "ramda";
import { number, shape, string } from "prop-types";

// TeamId :: String
export const TEAM1 = "team1";
export const TEAM2 = "team2";


export const scoreShape = shape({
  team: string.isRequired,
  score: number.isRequired
});

// Score :: { team, score } || null

// Scores :: Array Score
export const initialScores = [];


// scoreTeam ::  Number -> Number -> Scores -> Scores
export const scoreTeam = (team, score, scores) =>
  R.append({ team, score }, scores);


// scoreNone :: Scores -> Scores
export const scoreNone = scores => R.append(null, scores);


// common reducer for getTotalScore(s)
const scoreReducer = (tally, n) => {
  // if it goes over 21, back to 11!
  return R.when(R.gt(R.__, 21), () => 11)(tally + n);
};


// given an array of a score for each round, tally the final score
// getTotalScoreFor :: TeamId -> Scores -> Number
// TODO should I use R.transduce here?
export const getTotalScoreFor = (teamId, scores) => R.compose(
  R.reduce(scoreReducer, 0),
  R.map(R.prop("score")),
  R.filter(R.propEq("team", teamId)),
  R.reject(R.isNil)
)(scores);


// return an array of the total score for each round
// getTotalScores :: TeamId -> Scores -> [Number]
export const getTotalScoresFor = (teamId, scores) => R.compose(
  R.scan(scoreReducer, 0),
  R.map(R.cond([
    [ R.isNil, () => 0],
    [ R.propEq("team", teamId), R.prop("score")],
    [ R.T, () => 0 ]
  ]))
)(scores);
