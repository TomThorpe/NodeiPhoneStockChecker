module.exports = {

/**
 * The interval to wait in betwen polls (in milliseconds)
 */
interval : 3000, //milliseconds

/**
 * array of the models you want. Use the models list below if you arent sure of the model numbers
 */
modelsWanted : ["MN4V2B/A"],

/**
 * prowl API. Used for push notifications. Sign up at https://www.prowlapp.com and download the app to your phone
 * If you dont set this up you won't get push notifications, you will only get console output
 */
prowlApiKey : "", //add your API key

/**
 * The url to the list of stores. These are different for different countries
 * CHANGE THIS IF YOU ARE NOT IN THE UK
 * Verify the json works by accessing the URL yourself in the browser and make sure it looks sensibl
 */
storesJsonUrl : "https://reserve.cdn-apple.com/GB/en_GB/reserve/iPhone/stores.json",

/**
 * The url to the list of stock. These are different for different countries
 * CHANGE THIS IF YOU ARE NOT IN THE UK
 * Verify the json works by accessing the URL yourself in the browser and make sure it looks sensibl
 */
stockJsonUrl : "https://reserve.cdn-apple.com/GB/en_GB/reserve/iPhone/availability.json",

}