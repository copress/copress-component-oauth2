var helpers = require('../lib/oauth2-helper');

describe('oauth2-helper', function () {

    it('.generateJWT(payload, secret, alg)', function () {
        var secret = 'secret';
        var payload = {
            id: '8KyugAdP67ZERjmfHcG3sbQJ8Rs23FNx',
            clientId: '500',
            scope: ['basic'],
            createdAt: new Date()
        };
        var token = helpers.generateJWT(payload, secret, 'HS256');
        expect(token).to.be.a('string');
        expect(token).to.have.length(219);
    });
});