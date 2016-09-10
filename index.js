/*
 * Copyright 2016 Tom Thorpe
 *
 * Distributed under the ISC Licence 
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * Author: Tom Thorpe
 */

var rp = require('request-promise');
var Promise = require("bluebird");
var NodeCache = require("node-cache");
var models = require("./iphone-models.js");
var config = require("./config.js");

/**
 * Cache to stop messages being sent about stock on every request. If a message was already sent in last x seconds, it wont be sent again
 */
var notificationsSentCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 120
});

var storesRequest = {
  uri: config.storesJsonUrl,
  json: true
};

var stockRequest = {
  uri: config.stockJsonUrl,
  json: true
};

/**
 * Begin the process to check the stock, then recursively calls itself asyncronously to check the stock again after interval time
 * @param {object} stores - flattend associative array of stores. Store code as the key, and the store name as the value
 */
function getStock(stores) {
  getStockRequest(stores)
    .delay(config.interval)
    .then(function() {
      process.nextTick(function() {
        getStock(stores)
      }); //nexttick to stop memory leaking in recursion, force async
    })
}

/**
 * Makes a single call to the stock url to check the stock.
 * @param {object} stores - flattend associative array of stores. Store code as the key, and the store name as the value
 */
function getStockRequest(stores) {
  return rp(stockRequest)
    .then(function(stock) {
      console.log("got stock list");
      processStock(stores, stock);
    })
    .catch(function(err) {
      reportError("Error downloading stock list " + err)
    });
}

/**
 * Once stock is retrieved from the stock url, checks the stock to see if it has any models you're interested in
 * @param {object} stores - flattend associative array of stores. Store code as the key, and the store name as the value
 * @param {object} stock - parsed json retreived from the stock url
 */
function processStock(stores, stock) {
  var storesWithStock = [];
  var unfoundModels = {}; //where the model code doesnt exist

  Object.keys(stock).forEach(function(storeCode) {
    var store = stores[storeCode];
    if (store == undefined) {
      return; //skip non-stores
    }
    checkStoreStock(store, storeCode, stock, storesWithStock, unfoundModels);
  });

  sendStockMessage(storesWithStock);
  sendUnfoundModelsMessage(unfoundModels)
}

/**
 * For a single store (represented by storcode) checks that stores stock to see if it has a model you are interested in
 * @param {string} store - The store name (e.g. Covent Garden)
 * @param {object} storeCode - the store code (e.g. R232)
 * @param {object} stock - parsed json retreived from the stock url
 * @param {array} storesWithStock - A string array, stores that have stock of the model you are interest in will be added to this array (in the format of a user displayable string message saying x store has stock of y)
 * @param {object} unfoundModels - associative array, models that were not found in the stores stock list will be added to this so that you can report back to the user that they may have a typo or non-existant model
 */
function checkStoreStock(store, storeCode, stock, storesWithStock, unfoundModels) {
  var storeStock = stock[storeCode];
  config.modelsWanted.forEach(function(modelCode) {
    if (storeStock[modelCode] == undefined) {
      unfoundModels[modelCode] = 1;
    } else if (storeStock[modelCode].toLowerCase() == "all") {
      addStoreToNotification(storesWithStock, store, modelCode, storeCode);
    }
  });
}

/**
 * Adds a store to the list of stores with stock, when stock of a model is found
 * First of all checks the cache to see if a notification was already sent about this store and this model, if so, this will skip adding that model to the notification and do nothing.
 * @param {array} storesWithStock - A string array, stores that have stock of the model you are interest in (and no message was already sent recently) will be added to this array (in the format of a user displayable string message saying x store has stock of y).
 * @param {string} store - The store name (e.g. Covent Garden)
 * @param {string} modelCode - The model found in stock
 * @param {object} storeCode - the store code (e.g. R232) the stock was found in
 */
function addStoreToNotification(storesWithStock, store, modelCode, storeCode) {
  //check if it is in the cache to say a notification was already recently sent about this store
  var key = storeCode + modelCode;
  var cached = notificationsSentCache.get(key);
  if (cached == undefined) {
    notificationsSentCache.set(key, "sent");
    storesWithStock.push(store + " has stock of " + models.models[modelCode]);
  }
}

/**
 * Chunks an array.
 * Returns an array of arrays, all of max n size
 */
function chunk (array, size) {
  return array.reduce(function (res, item, index) {
    if (index % size === 0) { res.push([]); }
    res[res.length-1].push(item);
    return res;
  }, []);
}

/**
 * Send the notification about models found stock (if any - if no models are found no notification will be displayed, and 
 * "No Stock" is diplayed in the console)
 * Sends at most 50 stores at a time, so chunks into multiple messages if there are more stores with stock.
 * @param {array} storesWithStock an array of messages about stock found in stores, e.g. ["model x was found in y", "model z was found in y"]. This will be used as the notificaiton text
 */
function sendStockMessage(storesWithStock) {
  if (storesWithStock.length > 0) {
    var chunks = chunk(storesWithStock, 50);

    chunks.forEach(function(storesChunk){
      var message = "";
      storesChunk.forEach(function(storeMessage) {
        message += storeMessage + "\n";
      });

      console.log(message);
      sendProwlMessage(message, 2);

    })
    
  } else {
    console.log("No New Stock");
  }
}

/**
 * Send the notification about models that were not found in any of the store lists (e.g. due to issue with store feed)
 * @param {object} unfoundModels an associative array of model codes as keys where the model was not found (e.g. {"B35643" : anything, "FKGJF" : anything} )
 */
function sendUnfoundModelsMessage(unfoundModels) {
  var unfound = "";
  for (var key in unfoundModels) {
    if (unfoundModels.hasOwnProperty(key)) {
      unfound += key + " ";
    }
  }
  if (unfound.length > 0) {
    reportError("Some of the models you requested were not found in the store stock list, there is either a problem with the store feed, or you have picked the wrong models for the country you chose " + unfound);
  }

}

/**
 * Sends a message over prowl to the user if theprowlApiKey variable is set up.
 * Does nothing if no api key exists
 * @param {string} message The message to send. This is the exact text that will get sent as the notification
 * @param {int} priority A priority between -2 (least priority) an 2 (most priority) as defined in the prowl API
 */
function sendProwlMessage(message, priority) {
  if (config.prowlApiKey.length > 0) {
    var prowlApiRequest = {
      method: 'POST',
      uri: 'https://api.prowlapp.com/publicapi/add',
      form: {
        apikey: config.prowlApiKey,
        priority: priority,
        application: "Stock Checker",
        "event": "iPhone 7 Stock",
        description: message,
      },
    };

    rp(prowlApiRequest)
      .then(function() {
        console.log("push notification sent");
      })
      .catch(function(err) {
        console.log("Error sending push notification" + err);
      });
  } else {
    console.log("Prowl message skipped due to no api key");
  }
}

/**
 * Logs an error on the console and by sending a prowl message
 * @param {string} error the error message
 */
function reportError(error) {
  var message = "iPhone Stock Checker Error: " + error;
  console.log("ERROR:" + message);
  sendProwlMessage(message, 0);
}

/**
 * Validates the models you have asked for are in the valid models list (models) and the list isnt empty;
 */
function validateWantedModels() {
  //no wanted models
  if (config.modelsWanted.length == 0) {
    reportError("You have not set up any wanted models in the modelsWanted property. Polling has NOT started! ");
    return false;
  }

  //no models config
  if (models.models.length == 0) {
    reportError("There are no models in the models config, this is a configuration error. Polling has NOT started! ");
    return false;
  }

  //check validity of modelsWanted
  var invalidModels = [];
  config.modelsWanted.forEach(function(model) {
    if (models.models[model] == undefined) {
      invalidModels.push(model);
    }
  });

  if (invalidModels.length > 0) {
    var message = "Invalid models were found in your modelsWanted property. Polling has NOT started! ";
    message += invalidModels.reduce(function(result, current) {
      return result += " " + current
    }, "");
    reportError(message);
    return false
  }

  return true;
}

//Go!
if (validateWantedModels()) {
  rp(storesRequest)
    .then(function(stores) {
      console.log("Downloaded stores list");
      var storesFlattend = {};
      stores.stores.forEach(function(store) {
        storesFlattend[store.storeNumber] = store.storeName
      });

      sendProwlMessage("Stores list has been successfully downloaded, stock checker will now start. This is a test prowl message to preview the message you will get when stock arrives", 2);

      getStock(storesFlattend)
    })
    .catch(function(err) {
      reportError("Error downloading stores " + err);
    });
}
