module.exports = function (t) {
    return {
        "name": "OAuthPermission",
        "properties": {
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
            "scopes": t.JSON
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

