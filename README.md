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

```java 
auth_key = "auth_key_here";```
