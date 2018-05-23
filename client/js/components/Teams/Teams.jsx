// import React from "react";
//
// import { scoresShape, TEAM1, TEAM2, getTotalScore } from "../../types/scores.js";
//
// export default class Teams extends React.Component {
//
//   static propTypes = {
//     scores: scoresShape.isRequired
//   };
//
//   state = {
//     isOpen: false
//   }
//
//   render = () => {
//
//     const { scores } = this.props;
//
//     return (
//       <div className="teams">
//         <div className="team team--1">
//           <div className="team__color"></div>
//           {getTotalScore(TEAM1, scores)}
//         </div>
//         <div className="team team--2">
//           <div className="team__color"></div>
//           {getTotalScore(TEAM2, scores)}
//         </div>
//       </div>
//     );
//   };
// }
