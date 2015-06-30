var debug = require('debug')('sycle:oauth2:models');
var helpers = require('./oauth2-helper');

module.exports = function (sapp, options) {
    var models = sapp.models;
    options = options || {};

    var User = models[options.userModel] || models['User'];
    debug('User model: %s', User.modelName);

    var Application = models[options.applicationModel] || models['OAuthClientApplication'];
    debug('Application model: %s', Application.modelName);

    var getTTL = typeof options.getTTL === 'function' ? options.getTTL :
        function(responseType, clientId, resourceOwner, scopes) {
            if (typeof options.ttl === 'function') {
                return options.ttl(responseType, clientId, resourceOwner, scopes);
            }
            if (typeof options.ttl === 'number') {
                return options.ttl;
            }
            if (typeof options.ttl === 'object' && options.ttl !== null) {
                return options.ttl[responseType];
            }
            switch (responseType) {
                case 'code':
                    return 300;
                default:
                    return 14 * 24 * 3600; // 2 weeks
            }
        };


    var Users = {};
    Users.find = function(id, done) {
        debug("users.find(" + id + ")");
        User.findOne({where: {
            id: id
        }}, done);
    };

    Users.findByUsername = function(username, done) {
        debug("users.findByUsername(" + username + ")");
        User.findOne({where: {
            username: username
        }}, done);
    };

    Users.findByUsernameOrEmail = function(usernameOrEmail, done) {
        debug("users.findByUsernameOrEmail(" + usernameOrEmail + ")");
        User.findOne({where: {
            or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
            ]
        }}, done);
    };

    Users.save = function(id, username, password, done) {
        debug("users.save(" + username + ")");
        User.create({
            id: id,
            username: username,
            password: password
        }, done);
    };

    var Clients = {};
    Clients.find = Clients.findByClientId = function(clientId, done) {
        Application.findById(clientId, done);
    };

    var AccessTokens = {};
    AccessTokens.find = function(accessToken, done) {
        models.OAuthAccessToken.findOne({where: {
            token: accessToken
        }}, done);
    };

    AccessTokens.findByRefreshToken = function(refreshToken, done) {
        models.OAuthAccessToken.findOne({where: {
            refreshToken: refreshToken
        }}, done);
    };

    AccessTokens.delete = function(clientId, token, tokenType, done) {
        var where = {
            appId: clientId
        };
        if (tokenType === 'access_token') {
            where.token = token;
        } else {
            where.refreshToken = token;
        }
        models.OAuthAccessToken.destroyAll(where, done);
    };

    AccessTokens.save = function(token, clientId, resourceOwner, scopes, refreshToken, done) {
        var tokenObj;
        if (arguments.length === 2 && typeof token === 'object') {
            // save(token, cb)
            tokenObj = token;
            done = clientId;
        }
        var ttl = getTTL('token', clientId, resourceOwner, scopes);
        if (!tokenObj) {
            tokenObj = {
                token: token,
                appId: clientId,
                userId: resourceOwner,
                scopes: scopes,
                issuedAt: new Date(),
                expiresIn: ttl,
                refreshToken: refreshToken
            };
        }
        tokenObj.expiresIn = ttl;
        tokenObj.issuedAt = new Date();
        tokenObj.expiredAt = new Date(tokenObj.issuedAt.getTime() + ttl * 1000);
        models.OAuthAccessToken.create(tokenObj, done);
    };

    var AuthorizationCodes = {};
    AuthorizationCodes.findByCode = AuthorizationCodes.find = function(key, done) {
        models.OAuthAuthorizationCode.findOne({where: {
            code: key
        }}, done);
    };

    AuthorizationCodes.delete = function(code, done) {
        models.OAuthAuthorizationCode.findOne({where: {code: code}}, function (err, model) {
            if (err) return cb(err);
            if (!model) return cb();
            model.destroy(done);
        });
    };

    AuthorizationCodes.save = function(code, clientId, redirectURI, resourceOwner, scopes, done) {
        var codeObj;
        if (arguments.length === 2 && typeof AccessTokens === 'object') {
            // save(code, cb)
            codeObj = code;
            done = clientId;
        }
        var ttl = getTTL('code', clientId, resourceOwner, scopes);
        if (!codeObj) {
            codeObj = {
                //id: code,
                code: code,
                appId: clientId,
                userId: resourceOwner,
                scopes: scopes,
                redirectURI: redirectURI
            };
        }
        codeObj.expiresIn = ttl;
        codeObj.issuedAt = new Date();
        codeObj.expiredAt = new Date(codeObj.issuedAt.getTime() + ttl * 1000);
        models.OAuthAuthorizationCode.create(codeObj, done);
    };

    var Permissions = {};
    Permissions.find = function(appId, userId, done) {
        models.OAuthPermission.findOne({where: {
            appId: appId,
            userId: userId
        }}, done);
    };

    /*
     * Check if a client sapp is authorized by the user
     */
    Permissions.isAuthorized = function(appId, userId, scopes, done) {
        Permissions.find(appId, userId, function(err, perm) {
            if (err) {
                return done(err);
            }
            if (!perm) {
                return done(null, false);
            }
            var ok = helpers.isScopeAuthorized(scopes, perm.scopes);
            var info = ok ? { authorized: true} : {};
            return done(null, ok, info);
        });
    };

    /*
     * Grant permissions to a client sapp by a user
     */
    Permissions.addPermission = function(appId, userId, scopes, done) {
        models.OAuthPermission.findOrCreate({where: {
            appId: appId,
            userId: userId
        }}, {
            appId: appId,
            userId: userId,
            scopes: scopes,
            issuedAt: new Date()
        }, function(err, perm, created) {
            if (created) {
                return done(err, perm, created);
            } else {
                if (helpers.isScopeAuthorized(scopes, perm.scopes)) {
                    return done(err, perm);
                } else {
                    perm.updateAttributes({scopes: helpers.normalizeList(scopes)}, done);
                }
            }
        });
    };

    // Adapter for the oAuth2 provider
    var customModels = options.models || {};
    return {
        Users: customModels.Users || Users,
        Clients: customModels.Clients || Clients,
        AccessTokens: customModels.AccessTokens || AccessTokens,
        AuthorizationCodes: customModels.AuthorizationCodes || AuthorizationCodes,
        Permissions: customModels.Permissions || Permissions
    };

};