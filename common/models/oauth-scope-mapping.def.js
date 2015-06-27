module.exports = function (t) {
    return {
        "name": "OAuthScopeMapping",
        "properties": {
            "scope": {
                "type": String,
                "length": 255,
                "index": true,
                "description": "The scope name"
            },
            "route": {
                "type": String,
                "description": "The route as [verb] /api/users"
            }
        }
    };
};