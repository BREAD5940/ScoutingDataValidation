var auth_key = ""; // Authorization key obtained from the https://www.thebluealliance.com/account to use the API

function validate() {
  var s = SpreadsheetApp.getActiveSpreadsheet();
  var sht = s.getSheetByName("Sheet2");
  var drng = sht.getDataRange();
  var rng = sht.getRange(2,1, drng.getLastRow()-1,drng.getLastColumn());
  var rngA = rng.getValues();

  var scores = new Array(256).fill(0);
  var ents = new Array(256).fill(0);
  var match;
  for (var i = 0; i<rngA.length; i++) {
      match = rngA[i][3];
      scores[match] += rngA[i][4];
      ents[match] += 1;
  }

  var rngB = [];
  var b = 0;

  for (var i = 1; i < match; i++) {
    var diff = scores[i] - getTotalScore_("2022cc", i);
    rngB[b] = [];
    rngB[b].push(i, diff, ents[i]);
    b++;
  }

  var shtout = s.getSheetByName("Sheet2_Output");
  var outrng = shtout.getRange(2,1,rngB.length,3);
  outrng.setValues(rngB);

}

function getTotalScore_(eventKey, qualsNumber) {
  var response = UrlFetchApp.fetch("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/matches?X-TBA-Auth-Key=" + auth_key);
  var data = JSON.parse(response.getContentText());
  for (var i=0; i<data.length; i++) {
    if (data[i]["key"] == (eventKey + "_qm" + qualsNumber)) {
      var match = data[i];
      var redScore = match["score_breakdown"]["red"]["totalPoints"] - match["score_breakdown"]["red"]["foulPoints"];
      var blueScore = match["score_breakdown"]["blue"]["totalPoints"] - match["score_breakdown"]["blue"]["foulPoints"];
      var realScore = redScore + blueScore;
      return realScore;
    }
  }
  return null;
}
