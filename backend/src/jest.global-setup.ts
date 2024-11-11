const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    process.env.MONGO_URI = uri;
    process.env.JWT_SECRET = 'testsecret';
    (global).__MONGOINSTANCE = mongoServer;
};
