# TBA-Scouting-Validation
A google sheets app script that provides methods to validate scouted data via thebluealliance's V3 API. 

## Adding the Script To Your Sheet

First you want to add the script to your google sheet. 

1. Open your google spreadsheet and under "Extensions" select "App Scripts"
2. Copy and paste the contents of [Code.gs](https://github.com/BREAD5940/TBA-Scouting-Validation/blob/main/Code.gs) into the code editor on screen. 
3. Click save and give your project a name (eg. TBA Data Validation). 

## Generating an Auth Key

Before you can use the script's function, you'll need an auth key to access the bluealliance's API. 

1. Navigate to [thebluealliance's account page](https://www.thebluealliance.com/account).
2. If you haven't already created an account, you will be prompted to. Follow the steps, and navigate back to the account page in step 1. 
3. Under "Read API Keys" select "Create New Key" and give your key a name. 
4. Finally, copy and paste the key into the auth_key variable in the script. 

The first line in your script should looking something like this after following these steps: 

```javascript
auth_key = "auth_key_here";
```
## Using the Script

This far, the script provides support for two validation methods:

* ```VALIDATE_ALLIANCE_SCORE(eventKey, qualsNumber, robotOneTotal, robotTwoTotal, robotThreeTotal, red)```- returns the difference between the scouted alliance score and real alliance score reported by thebluealliance. Note that this method already factors fouls into the calculation, so this is not something that you need to worry about. 
* ```VALIDATE_ALLIANCE_ENDGAME(eventKey, qualsNumber, robotOneEndgame, robotTwoEndgame, robotThreeEndgame, red)``` - returns the difference between the scouted endgame alliance score and real endgame alliance score reported by the bluealliance. 

## Obtaining an Event Key

One of the parameters in all of the validation methods is `eventKey`. To obtain the `eventKey`, navigate to thebluealliance page for your particular event. For example, I would navigate to the following link to access thebluealliance page for the Monterey Bay Regional in 2022: 

```
https://www.thebluealliance.com/event/2022camb
```

At the end of the URL, we see `2022camb`. This is the `eventKey` that would be inputted into the validation functions above. 


