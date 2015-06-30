module.exports = function (t) {
    return {
        "name": "OAuthAccessToken",
        "properties": {
            "token": {
                "type": String,
                "length": 128
            },
            "appId": {
                "type": String,
                "length": 128,
                "index": true
            },
            "userId": {
                "type": Number,
                "index": true
            },
            "issuedAt": {
                "type": Date,
                "index": true
            },
            "expiresIn": Number,
            "expiredAt": {
                "type": Date,
                "index": true
            },
            "scopes": t.JSON, // [String]
            "parameters": t.JSON,
            "authorizationCode": {
                "type": String,
                "length": 128,
                "index": true
            },
            "refreshToken": {
                "type": String,
                "length": 128,
                "index": true
            },
            "tokenType": t.JSON, // enum: ["Bearer", "MAC"]
            "hash": String
        },
        "relations": {
            "application": {
                "type": "belongsTo",
                "model": "OAuthClientApplication",
                "foreignKey": "appId"
            },
            "user": {
                "type": "belongsTo",
                "model": "User",
                "foreignKey": "userId"
            }
        }
    };
};

