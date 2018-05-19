import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Twitter from "twitter";

const ApiUrl = "http://api.twitter.com/1.1";

export const TweetsReports = new Mongo.Collection("TweetsReports");

if (Meteor.isServer) {
    Meteor.publish("TweetsReports", function tweetsPublication() {
        return TweetsReports.find({});
    });

    Meteor.methods({
        "Twitter.GetTweets"() {
            console.log("Server | GetTweets");

            let consumerKey = Meteor.settings.TWITTER_CONSUMER_KEY,
                consumerSecret = Meteor.settings.TWITTER_CONSUMER_SECRET,
                accessTokenKey = Meteor.settings.TWITTER_ACCESS_TOKEN_KEY,
                accessTokenSecret = Meteor.settings.TWITTER_ACCESS_TOKEN_SECRET;

            let client = new Twitter({
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
                access_token_key: accessTokenKey,
                access_token_secret: accessTokenSecret
            });

            var params = { q: '#Reportax' };

            //console.log("GetTweets | Data: ", params, consumerKey, consumerSecret, accessTokenKey, accessTokenSecret);
            return client.get("search/tweets", params);
        },
        "Twitter.addTweetReport"(id, CreationDate, City, Placa, Empresa, Denuncia, Images, idDepartamento, nombreDepartamento, userName, screenName) {
            check(City, String);
            check(Placa, String);
            check(Denuncia, String);
            check(Images, Array);

            let userId = Meteor.user()._id;
            //let userName = Meteor.user().username;

            console.log("AddTweetReport | ", userId, userName, id, CreationDate, City, Empresa, Placa, Denuncia, Images, idDepartamento, nombreDepartamento, userName, screenName);

            TweetsReports.insert({
                _id: id,
                userId,
                userName,
                screenName,
                CreationDate,
                City,
                idDepartamento,
                nombreDepartamento,
                Placa,
                Denuncia,
                Images
            });
        }
    }); // Meteor.methods
}