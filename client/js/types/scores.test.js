/* global test, expect */

import {
  addScore, scoreNone, getTotalScore, getTotalScores, getRoundScores,
  TEAM1, TEAM2
} from "./scores.js";


test("addScore", () => {
  const startScores = { "team1": [ 2 ], "team2": [ 0 ] };
  const targetScores1 = { "team1": [ 2, 3 ], "team2": [ 0, 0 ] };
  const targetScores2 = { "team1": [ 2, 0 ], "team2": [ 0, 3 ] };

  expect(addScore(TEAM1, 3, startScores)).toEqual(targetScores1);
  expect(addScore(TEAM2, 3, startScores)).toEqual(targetScores2);
});


test("scoreNone", () => {
  const startScores = { "team1": [ 2 ], "team2": [ 0 ] };
  const targetScores = { "team1": [ 2, 0 ], "team2": [ 0, 0 ] };
  expect(scoreNone(startScores)).toEqual(targetScores);
});


test("getTotalScore", () => {
  expect(getTotalScore([null, 0, 2, 0, 2, 3, 0, null])).toEqual(7);
});


test("getTotalScores", () => {
  expect(getTotalScores([5, 0, 3, 1, 2, 3])).toEqual([0, 5, 5, 8, 9, 11, 14]);
});


test("getRoundScores", () => {
  const scores = { "team1": [ 2, 0, 0, 0 ], "team2": [ 0, 0, 4, 5 ] };
  const target = [
    { team: "team1", score: 2 },
    null,
    { team: "team2", score: 4 },
    { team: "team2", score: 5 }
  ];
  expect(getRoundScores(scores)).toEqual(target);
});
