/* global test, expect */

import {
  scoreTeam, scoreNone, getTotalScoreFor, getTotalScoresFor,
  TEAM1, TEAM2
} from "./scores.js";


const manyScores = [
  { team: "team1", score: 2 },
  { team: "team2", score: 3 },
  null,
  { team: "team1", score: 2 },
  { team: "team1", score: 1 },
  null,
  { team: "team2", score: 6 },
  { team: "team1", score: 1 }
];

test("scoreTeam", () => {
  const startScores = [ { team: "team1", score: 2 } ];
  const targetScores1 = [
    { team: "team1", score: 2 },
    { team: "team1", score: 3 }
  ];
  const targetScores2 = [
    { team: "team1", score: 2 },
    { team: "team2", score: 3 }
  ];

  expect(scoreTeam(TEAM1, 3, startScores)).toEqual(targetScores1);
  expect(scoreTeam(TEAM2, 3, startScores)).toEqual(targetScores2);
});


test("scoreNone", () => {
  const startScores = [ { team: "team1", score: 2 } ];
  const targetScores = [ { team: "team1", score: 2 }, null ];
  expect(scoreNone(startScores)).toEqual(targetScores);
});


test("getTotalScoreFor", () => {
  expect(getTotalScoreFor(TEAM1, manyScores)).toEqual(6);
  expect(getTotalScoreFor(TEAM2, manyScores)).toEqual(9);
});


test("getTotalScoresFor", () => {
  expect(getTotalScoresFor(TEAM1, manyScores)).toEqual([0, 2, 2, 2, 4, 5, 5, 5, 6]);
  expect(getTotalScoresFor(TEAM2, manyScores)).toEqual([0, 0, 3, 3, 3, 3, 3, 9, 9]);
});
