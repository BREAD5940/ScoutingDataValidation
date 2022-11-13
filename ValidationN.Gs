var auth_key = "sUA7XjgZaQysbshLwgVMck8AGqUMQZJCTBazacjNOiN3D2lxJXD02aoLQGw9MXRV"; // Authorization key obtained from the https://www.thebluealliance.com/account to use the API
var eventKey = "2022mttd"; // Can be obtained from thebluealliance
var inputSheet = "Sheet1"; // This sheet must exist
var outputSheet = "Match_Checking"; // This sheet must exist

function validate() {
  var s = SpreadsheetApp.getActiveSpreadsheet();
  var sht = s.getSheetByName(inputSheet);
  var drng = sht.getDataRange();
  var rng = sht.getRange(2,1, drng.getLastRow()-1,drng.getLastColumn());
  var rngA = rng.getValues();

  // Arrays to hold all the match data lol
  var redScore = new Array(256).fill(0);
  var redAllianceTaxiCount = new Array(256).fill(0);
  var redTeleopCargoCount = new Array(256).fill(0);
  var redAutoCargoCount = new Array(256).fill(0);
  var redHangarScore = new Array(256).fill(0);

  var blueScore = new Array(256).fill(0);
  var blueAllianceTaxiCount = new Array(256).fill(0);
  var blueTeleopCargoCount = new Array(256).fill(0);
  var blueAutoCargoCount = new Array(256).fill(0);
  var blueHangarScore = new Array(256).fill(0);

  var ents = new Array(256).fill(0);

  var matchNum;
  for (var i = 0; i<rngA.length; i++) {
      matchNum = rngA[i][3];
      teamNum = rngA[i][0];
      if (isOnRedAlliance_(eventKey, matchNum, teamNum)) {
        redScore[matchNum] += rngA[i][4];
        redAllianceTaxiCount[matchNum] += rngA[i][23] == "Yes" ? 1 : 0;
        redTeleopCargoCount[matchNum] += rngA[i][15] + rngA[i][17];
        redAutoCargoCount[matchNum] += rngA[i][10] + rngA[i][13];
        redHangarScore[matchNum] += rngA[i][6];
      } else {
        blueScore[matchNum] += rngA[i][4];
        blueAllianceTaxiCount[matchNum] += rngA[i][23] == "Yes" ? 1 : 0;
        blueTeleopCargoCount[matchNum] += rngA[i][15] + rngA[i][17];
        blueAutoCargoCount[matchNum] += rngA[i][10] + rngA[i][13];
        blueHangarScore[matchNum] += rngA[i][6];
      }
      ents[matchNum] += 1;
  }

  var rngB = [];
  var b = 0;

  for (var i = 1; i < matchNum; i++) {

    // RED
    var redScoreDiff = redScore[i] - getAllianceScore_(eventKey, i, true);
    var redAllianceTaxiCountDiff = redAllianceTaxiCount[i] - getAllianceTaxiCount_(eventKey, i, true);
    var redTeleopCargoCountDiff = redTeleopCargoCount[i] - getAllianceTeleopCargoCount_(eventKey, i, true);
    var redAutoCargoCountDiff = redAutoCargoCount[i] - getAllianceAutoCargoCount_(eventKey, i, true);
    var redHangarScoreDiff = redHangarScore[i] - getAllianceHangarScore_(eventKey, i, true);

    // BLUE
    var blueScoreDiff = blueScore[i] - getAllianceScore_(eventKey, i, false);
    var blueAllianceTaxiCountDiff = blueAllianceTaxiCount[i] - getAllianceTaxiCount_(eventKey, i, false);
    var blueTeleopCargoCountDiff = blueTeleopCargoCount[i] - getAllianceTeleopCargoCount_(eventKey, i, false);
    var blueAutoCargoCountDiff = blueAutoCargoCount[i] - getAllianceAutoCargoCount_(eventKey, i, false);
    var blueHangarScoreDiff = blueHangarScore[i] - getAllianceHangarScore_(eventKey, i, false);

    rngB[b] = [];
    rngB[b].push(
      i, 
      redScoreDiff, 
      redAllianceTaxiCountDiff,
      redTeleopCargoCountDiff,
      redAutoCargoCountDiff,
      redHangarScoreDiff,
      blueScoreDiff, 
      blueAllianceTaxiCountDiff,
      blueTeleopCargoCountDiff,
      blueAutoCargoCountDiff,
      blueHangarScoreDiff,
      ents[i]
    );
    b++;
  }

  var shtout = s.getSheetByName(outputSheet);
  var outrng = shtout.getRange(2,1,rngB.length,12);
  outrng.setValues(rngB);

}

// Returns the alliance that the given robot is on
function isOnRedAlliance_(eventKey, qualsNumber, teamNumber) {
  var match = getMatch_(eventKey, qualsNumber);
  var redRobots = match["alliances"]["red"]["team_keys"];
  for (var i = 0; i < 3; i++) {
    if (redRobots[i].slice(3)==teamNumber) {
      return true;
    }
  }
  return false;
}

// Returns the number of robots on an alliance that achieved the taxi bonus
function getAllianceTaxiCount_(eventKey, qualsNumber, red) {
  var match = getMatch_(eventKey, qualsNumber);
  if (red) {
    var count = 0;
    for (var i = 1; i <= 3; i++) {
      if (match["score_breakdown"]["red"]["taxiRobot" + i]=="Yes") {
        count++;
      }
    }
    return count;
  } else {
    var count = 0;
    for (var i = 1; i <= 3; i++) {
      if (match["score_breakdown"]["blue"]["taxiRobot" + i]=="Yes") {
        count++;
      }
    }
    return count;
  }
}

// Returns the number of teleop cargo scored by an alliance
function getAllianceTeleopCargoCount_(eventKey, qualsNumber, red) {
  var match = getMatch_(eventKey, qualsNumber);
  if (red) {
    return match["score_breakdown"]["red"]["teleopCargoTotal"];
  } else {
    return match["score_breakdown"]["blue"]["teleopCargoTotal"];
  }
}

// Returns the number of auto cargo scored by an alliance
function getAllianceAutoCargoCount_(eventKey, qualsNumber, red) {
  var match = getMatch_(eventKey, qualsNumber);
  if (red) {
    return match["score_breakdown"]["red"]["autoCargoTotal"];
  } else {
    return match["score_breakdown"]["blue"]["autoCargoTotal"];
  }
}

// Returns the number of points scored by an alliance in the hangar
function getAllianceHangarScore_(eventKey, qualsNumber, red) {
  var match = getMatch_(eventKey, qualsNumber);
  if (red) {
    return match["score_breakdown"]["red"]["endgamePoints"];
  } else {
    return match["score_breakdown"]["blue"]["endgamePoints"];
  }
}

// Returns the total number of points returned by an alliance
function getAllianceScore_(eventKey, qualsNumber, red) {
  var match = getMatch_(eventKey, qualsNumber);
  if (red) {
    return match["score_breakdown"]["red"]["totalPoints"] - match["score_breakdown"]["red"]["foulPoints"];
  } else {
    return match["score_breakdown"]["blue"]["totalPoints"] - match["score_breakdown"]["blue"]["foulPoints"];
  }
}

// Returns match data
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
