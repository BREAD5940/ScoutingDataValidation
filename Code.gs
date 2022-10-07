var auth_key = ""; // Authorization key obtained from the https://www.thebluealliance.com/account to use the API

// COMPARES THE REAL ALLIANCE SCORE (AS REPORTED BY https://www.thebluealliance.com) TO THE SCOUTED ALLIANCE SCORE.
// 0 DENOTES NO DIFFERENCE BETWEEN THE SCOUTED ALLIANCE SCORE AND REAL ALLIANCE SCORE.
// A NEGATIVE NUMBER MEANS THAT THE SCOUTED ALLIANCE SCORE IS AN LESS THAN THE REAL ALLIANCE SCORE.
// A POSITIVE NUMBER MEANS THAT THE SCOUTED ALLIANCE SCORE IS AN GREATER THAN THE REAL ALLIANCE SCORE.
function VALIDATE_ALLIANCE_SCORE(eventKey, qualsNumber, robotOneTotal, robotTwoTotal, robotThreeTotal, red){
  var match = getMatch_(eventKey, qualsNumber);

  var realScore;
  var scoutedScore = robotOneTotal + robotTwoTotal + robotThreeTotal;
  if (red) {
    realScore = match["score_breakdown"]["red"]["totalPoints"] - match["score_breakdown"]["red"]["foulPoints"];
  } else {
    realScore = match["score_breakdown"]["blue"]["totalPoints"] - match["score_breakdown"]["blue"]["foulPoints"];
  }
  return scoutedScore - realScore;
}

// COMPARES THE REAL SCORE TOTAL (AS REPORTED BY https://www.thebluealliance.com) TO THE SCOUTED TOTAL SCORE.
// 0 DENOTES NO DIFFERENT BETWEEN THE SCOUTED ALLIANCE SCORE AND REAL SCORE.
// A NEGATIVE NUMBER MEANS THAT THE SCOUTED ALLIANCE SCORE IS AN LESS THAN THE REAL ALLIANCE SCORE.
// A POSITIVE NUMBER MEANS THAT THE SCOUTED ALLIANCE SCORE IS AN GREATER THAN THE REAL ALLIANCE SCORE.
function VALIDATE_TOTAL_SCORE(eventKey, qualsNumber, scoutedScore) {
  var match = getMatch_(eventKey, qualsNumber);

  var redScore = match["score_breakdown"]["red"]["totalPoints"] - match["score_breakdown"]["red"]["foulPoints"];
  var blueScore = match["score_breakdown"]["blue"]["totalPoints"] - match["score_breakdown"]["blue"]["foulPoints"];
  var realScore = redScore + blueScore;

  return scoutedScore - realScore;
}

// COMPARES THE REAL ENDGAME SCORE OF AN ALLIANCE (AS REPORTED BY https://www.thebluealliance.com) TO THE SCOUTED ENGAME SCORE OF AN ALLIANCE.
// 0 DENOTES NO DIFFERENCE BETWEEN THE SCOUTED ENDGAME ALLIANCE SCORE AND THE REAL ENDGAME ALLIANCE SCORE.
// A NEGATIVE NUMBER MEANS THAT THE SCOUTED ENDGAME ALLIANCE SCORE IS LESS THAN THE REAL ENDGAME ALLIANCE SCORE. 
// A POSITIVE NUMBER MEANS THAT THE SCOUTED ENDGAME ALLIANCE SCORE IS GREATER THAN THE REAL ENDGAME ALLIANCE SCORE. 
function VALIDATE_ALLIANCE_ENDGAME(eventKey, qualsNumber, robotOneEndgame, robotTwoEndgame, robotThreeEndgame, red) {
  var match = getMatch_(eventKey, qualsNumber);

  var realEndgame;
  var scoutedEndgame = robotOneEndgame + robotTwoEndgame + robotThreeEndgame;
  if (red) {
    realEndgame = match["score_breakdown"]["red"]["endgamePoints"];
  } else {
    realEndgame = match["score_breakdown"]["blue"]["endgamePoints"];
  }
  return scoutedEndgame - realEndgame;
}

/* Utility function to get a match, given the eventKey and qualification number of the match. */
function getMatch_(eventKey, qualsNumber) {
  var response = UrlFetchApp.fetch("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches?X-TBA-Auth-Key=" + auth_key);
  var data = JSON.parse(response.getContentText());
  for (var i=0; i<data.length; i++) {
    if (data[i]["key"] == (eventKey + "_qm" + qualsNumber)) {
      return data[i];
    }
  }
  return null;
}
