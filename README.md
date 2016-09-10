# NodeiPhoneStockChecker
A Node.js project to poll the apple in-store reservations checker for iphones and send you a notification

Given a list of models you are interested in, this script polls the apple in-store pickup reservations and notifies you when stock of one of those models is found in any store.

_Note: This project uses Prowl to send notifications to you when stock is found, so you will need that. The app is nothing to do with me and not an endorsement, but it is a very useful notification tool. Sign up at https://www.prowlapp.com and get it from the app store)_

# Usage instructions
* Make sure you have node installed and an environment to be able to leave this script running
* I suggest Digital Ocean, use my referral code ( https://m.do.co/c/a3dff0c5c6c3 ) to get $10 free credit, enough to run this script the simplest droplet for 2 months (and I get a bonus too!)
* Clone this repo to your envirionment
* Run "npm install"
* Open index.js and edit the properties at the top of the file under BEGIN CONFIG OPTIONS.
  * `interval` - The interval between polling in milliseconds. I suggest 3 seconds (3000 milliseconds). Dont make it to small.
  * `modelsWanted` - An array of strings of the models you want. The script will search for these models in any stores. There is a full list of models at the end of this readme, or also in index.js just underneath the config options
  * `prowlApiKey` The API key for your prowl account. Get it from the API tab at https://www.prowlapp.com
  * `pushNotificationOpenUrl` the URL to open when swiping the push notification. I suggest this be the URL for reserving phones in your country (if you are not from the UK you will need to change this). This is not required.
  * `storesJsonUrl` Stores list JSON If you are not in the UK, you need to set this to the JSON url for location of your choice by figuring out the URL (e.g. https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/stores.json for the USA)
  * `stockJsonUrl`  Stock list JSON If you are not in the UK, you need to set this to the JSON url for location of your choice by figuring out the json (e.g. https://reserve.cdn-apple.com/US/en_US/reserve/iPhone/availability.json for the USA)
* Save your changes to the index.js file
* Run `npm start`. The script will display debug info on the console output, and also send you a test push notification so that you know notifications are working


# List of iPhone 7 Model Numbers
```
  "MN8X2B/A": "iPhone 7 32GB Black",
  "MN8Y2B/A": "iPhone 7 32GB Silver",
  "MN902B/A": "iPhone 7 32GB Gold",
  "MN912B/A": "iPhone 7 32GB Rose Gold",
  "MN922B/A": "iPhone 7 128GB Black",
  "MN932B/A": "iPhone 7 128GB Silver",
  "MN942B/A": "iPhone 7 128GB Gold",
  "MN952B/A": "iPhone 7 128GB Rose Gold",
  "MN962B/A": "iPhone 7 128GB Jet Black",
  "MN972B/A": "iPhone 7 256GB Black",
  "MN982B/A": "iPhone 7 256GB Silver",
  "MN992B/A": "iPhone 7 256GB Gold",
  "MN9A2B/A": "iPhone 7 256GB Rose Gold",
  "MN9C2B/A": "iPhone 7 256GB Jet Black",
  "MN4M2B/A": "iPhone 7 Plus 128GB Black",
  "MN4P2B/A": "iPhone 7 Plus 128GB Silver",
  "MN4Q2B/A": "iPhone 7 Plus 128GB Gold",
  "MN4U2B/A": "iPhone 7 Plus 128GB Rose Gold",
  "MN4V2B/A": "iPhone 7 Plus 128GB Jet Black",
  "MN4W2B/A": "iPhone 7 Plus 256GB Black",
  "MN4X2B/A": "iPhone 7 Plus 256GB Silver",
  "MN4Y2B/A": "iPhone 7 Plus 256GB Gold",
  "MN502B/A": "iPhone 7 Plus 256GB Rose Gold",
  "MN512B/A": "iPhone 7 Plus 256GB Jet Black",
  "MNQM2B/A": "iPhone 7 Plus 32GB Black",
  "MNQN2B/A": "iPhone 7 Plus 32GB Silver",
  "MNQP2B/A": "iPhone 7 Plus 32GB Gold",
  "MNQQ2B/A": "iPhone 7 Plus 32GB Rose Gold"
  ```
