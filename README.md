## Update
It seems apple now have two different ways of querying stock. This script uses the old way, and it seems like they might be phasing that out to try and stop people scraping data. I can't guarantee this script will work anymore now - sorry!

# NodeiPhoneStockChecker

A Node.js project to poll the apple in-store reservations checker for iphones and send you a notification

Given a list of models you are interested in, this script polls the apple in-store pickup reservations and notifies you when stock of one of those models is found in any store.

_Note: This project uses Prowl to send notifications to you when stock is found, so you will need that. The app is nothing to do with me and not an endorsement, but it is a very useful notification tool. Sign up at https://www.prowlapp.com and get it from the app store)_

# Usage instructions
* Make sure you have node installed and an environment to be able to leave this script running
* I suggest Digital Ocean, use my referral code ( https://m.do.co/c/a3dff0c5c6c3 ) to get $10 free credit, enough to run this script the simplest droplet for 2 months (and I get a bonus too!)
* Clone this repo to your envirionment
* Run "npm install"
* Rename `config.js.example` to be `config.js`.
* Edit `config.js` to include the properties for whatever you need.
  * `interval` - The interval between polling in milliseconds. I suggest 3 seconds (3000 milliseconds). Dont make it to small.
  * `modelsWanted` - An array of strings of the models you want. The script will search for these models in any stores. There is a full list of models in the `iphone-models.js` file. **Remember to pick one for your country, and the right type e.g. GSM**. If it is not there, try and research the model number and maybe open a PR to add it here :-)
  * `prowlApiKey` The API key for your prowl account. Get it from the API tab at https://www.prowlapp.com
  * `storesJsonUrl` Stores list JSON If you are not in the UK, you need to set this to the JSON url for location of your choice by figuring out the URL (e.g. https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/stores.json for the USA)
  * `stockJsonUrl`  Stock list JSON If you are not in the UK, you need to set this to the JSON url for location of your choice by figuring out the json (e.g. https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/availability.json for the USA)
* Save your changes to the index.js file
* Run `npm start`. The script will display debug info on the console output, and also send you a test push notification so that you know notifications are working
* *Remember, if you close your window, the task will stop running!* If you are using digitalocean or another remote server, you might want to first run `tmux` (https://danielmiessler.com/study/tmux/) before running `npm start` so that you can leave the task running. You may also want to use something like `forever` (https://www.npmjs.com/package/forever) so that if the script does crash for some reason it will be restarted

# Tips
* When stock is found this tool sends it with a priority of "Emergency" in Prowl. If you change the notification sounds in Prowl you can set a longer and louder notification alert for Emergency messages
