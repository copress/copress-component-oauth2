var syclify = require('syclify');
var t = require('chai').assert;
var modelsBuilder = require('../lib/models');

describe('sycle-component-oauth2/models', function () {

    it('should work', function (done) {
        //this.timeout(2000);
        var p = __dirname + '/..';
        var sapp = syclify({
            modules: [p],
            db: {
                autoupdate: true,
                driver: 'mysql',
                collation: 'utf8_unicode_ci',
                database: 'oauth_test',
                username: 'root'
            }
        });
        sapp.boot(function (err) {
            if (err) throw err;

            modelsBuilder(sapp);

            done();
        })
    });
});