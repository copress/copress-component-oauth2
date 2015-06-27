/**
 * Module dependencies.
 */

var exports = module.exports = require('./lib/oauth2-sycle');

exports.oauth2orize = require('./lib/oauth2orize');

/**
 * A factory function for middleware handler that obtains the `authentication`
 * handler configured by the OAuth2 component.
 */
exports.authenticate = function (options) {
    var router;
    return function oauth2AuthenticateHandler(req, res, next) {
        if (!router) {
            var app = req.app;
            var authenticate = app._oauth2Handlers && app._oauth2Handlers.authenticate;

            if (!authenticate) {
                return next(new Error('The OAuth2 component was not configured for this application.'));
            }

            var handlers = authenticate(options);
            router = app.expressx.Router();
            for (var i = 0, n = handlers.length; i < n; i++) {
                router.use(handlers[i]);
            }
        }

        return router(req, res, next);
    };
};
