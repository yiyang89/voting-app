// collection: stocks;
// No deletes, this collection will act as a cache
// methods:
// getAll(stocksObject, callback) - Takes the currently loaded stocks and looks them all up in mongo (for on connect);
// getOne(code, callback) - Get the data for 1 stock code (for on add - cache functionality);
// updateAll(data, callback) - Update stock data for all loaded stocks(aka for up to yesterday's closing);
var mongodb = require('mongodb');


module.exports.getPolls = function(mongoConnection, callback) {
  mongoConnection.collection('polls').find().toArray( function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // If no results found, redirect to a page notifying user
      console.log("mongodb getPolls success, stripping ip's");
      // Strip ip's from results.
      result.forEach(function(pollData) {
        pollData.voted.forEach(function(voteEntry) {
          voteEntry.user_ip = null;
        })
      });
      callback(err, result);
    }
  });
}

module.exports.createPoll = function(mongoConnection, user_id, poll_question, poll_answers, callback) {
  var newEntry = {"creator_id": user_id, "question": poll_question, "answers": poll_answers, "voted":[]};
  mongoConnection.collection('polls').insertOne(newEntry, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      callback(err, result);
    }
  });
}

module.exports.deletePoll = function(mongoConnection, poll_id, user_id, callback) {
  var filterclause = {'_id': mongodb.ObjectId(poll_id), 'creator_id': user_id};
  mongoConnection.collection('polls').findOneAndDelete(filterclause, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("mongodb removeQuery success: " + JSON.stringify(result));
      callback(err, result);
    }
  });
}

// Do a find for the question
// See if votes for this question contains a vote by this user_ip already
module.exports.votePoll = function(mongoConnection, user_ip, poll_id, answer, user_id, callback) {
  var filterclause = {'_id': mongodb.ObjectId(poll_id)};
  // Find existing voted array
  mongoConnection.collection('polls').find(filterclause).toArray( function (err, result) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else if (result.length === 0) {
      callback("Unable to find this poll", null);
    } else {
      // Update the 'voted' array if user ip has not voted on this before.
      var singleResult = result[0];
      var hasVoted = false;
      singleResult.voted.forEach( function(entry) {
        if (entry.user_ip === user_ip) {
          hasVoted = true;
        }
      });
      if (hasVoted) {
        callback("User already has a vote on this poll", null);
      } else {
        // Update answer array if we are dealing with a new answer
        if (!singleResult.answers.includes(answer)) {
          singleResult.answers.push(answer);
        }
        singleResult.voted.push({'user_ip': user_ip, 'user_id': user_id, 'answer': answer});
        mongoConnection.collection('polls').update(filterclause, singleResult, function(err, result) {
          console.log("Updated poll id: " + poll_id)
          callback(err, result);
        });
      }
    }
  });
}

module.exports.getTokenDetails = function(mongoConnection, token, callback) {
  var filterclause = {'accessToken': token};
  mongoConnection.collection('accessTokens').findOne(filterclause, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // If no results found, redirect to a page notifying user
      console.log("MongoDB fetched details for token " + token);
      callback(err, result);
    }
  });
}

module.exports.saveToken = function(mongoConnection, token, profile, callback) {
  var newEntry = {"accessToken": token, "profile": profile};
  mongoConnection.collection('accessTokens').insertOne(newEntry, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      callback(err, result);
    }
  });
}

module.exports.removeToken = function(mongoConnection, token, callback) {
  var filterclause = {'accessToken': token};
  mongoConnection.collection('accessTokens').findOneAndDelete(filterclause, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("mongodb removeQuery result: " + JSON.stringify(result));
      callback(err, result);
    }
  });
}
