"use strict";

module.exports = function (t) {
    return {
        name: "OAuthAuthorizationCode",
        properties: {
            id: {type: String, index: true, required: true},
            appId: {type: String, index: true},
            userId: {type: Number, index: true},
            issuedAt: {type: Date, index: true},
            expiresIn: Number,
            expiredAt: {type: Date, index: true},
            scopes: t.JSON, // [String]
            parameters: t.JSON,
            used: Boolean,
            redirectURI: String,
            hash: String
        },
        relations: {
            application: {
                type: 'belongsTo',
                model: 'Application',
                foreignKey: 'appId'
            },
            user: {
                type: "belongsTo",
                model: "User",
                foreignKey: "userId"
            }
        }
    }
};