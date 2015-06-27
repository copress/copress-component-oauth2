module.exports = function (t) {
    return {
        "name": "OAuthScope",
        "properties": {
            "scope": {
                "type": String,
                "id": true,
                "generated": false
            },
            "description": String,
            "iconURL": String,
            "ttl": Number
        }
    }
};
