"use strict";

module.exports = function (t) {
    return {
        "name": "OAuthClientApplication",
        "base": "Application",
        "properties": {
            "id": {
                "type": String
            },
            "clientType": {
                "type": String // enum ["public", "confidential"]
            },
            "redirectURIs": t.JSON, // [String]
            "tokenEndpointAuthMethod": {
                "type": String // ["none", "client_secret_post", "client_secret_basic"]
            },
            "grantTypes": t.JSON,   // {Array} enum ["authorization_code", "implicit", "client_credentials",
                                    // "password", "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                    // "urn:ietf:params:oauth:grant-type:saml2-bearer"]
            "responseTypes": t.JSON, // {Array} enum ["code", "token"]
            "tokenType": String, // enum ["bearer", "jwt", "mac"]
            "clientSecret": String,
            "clientName": String,
            "clientURI": String,
            "logoURI": String,
            "scopes": t.JSON,
            "contacts": t.JSON,
            "tosURI": String,
            "policyURI": String,
            "jwksURI": String,
            "jwks": {
                "type": t.JSON
                //"mysql": {
                //    "dataLength": 4096,
                //    "dataType": "TEXT"
                //}
            },
            "softwareId": String,
            "softwareVersion": String,

            "callbackUrls": t.JSON,
            "permissions": t.JSON,
            "authenticationEnabled": t.JSON,
            "anonymousAllowed": t.JSON,
            "authenticationSchemes": t.JSON,
            "icon": t.JSON,
            "url": t.JSON
        },
        "comments": "https://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-24"
    }
};