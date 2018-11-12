const {
    AnonymousAuthProvider,
    JSONSerializer,
    NodeWebSocketTransport,

    Connection,
} = require('@verkehrsministerium/kraftfahrstrasse');

const Logger = require('logplease');
const logger = Logger.create('index.js');

const connection = new Connection({
    endpoint: 'ws://localhost:8001',
    serializer: new JSONSerializer(),
    transport: NodeWebSocketTransport,
    transportOptions: {},
    authProvider: new AnonymousAuthProvider(),
    logFunction: console.log,
    realm: 'test',
});

const main = async () => {
    await connection.Open();
    await connection.Register('rocks.check', () => {
        const callResult  = {
            args: [
                true
            ]
        };

        logger.debug('Called rocks.check');

        return Promise.resolve(callResult);
    }).then(() => {
        logger.debug('Registered rocks.check');

    });

    await connection.Register('rocks.test', () => {
        const callResult  = {
            args: [
                true
            ]
        };

        logger.debug('Called rocks.test');


        return Promise.resolve(callResult);
    }).then(() => {
        logger.debug('Registered rocks.test');
    });

    while(true) {
        await connection.Call('rocks.test').then(() => {
            logger.debug('Calling rocks.test');

            return new Promise((resolve) => {
                setTimeout(resolve, 500)
            })
        })

    }

};

main().then(() => {});

