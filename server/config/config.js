process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30
process.env.SEED = process.env.SEED || 'este-es-el-desarrollo'
process.env.CLIENT_ID = process.env.CLIENT_ID || '897713198922-cgpl602gb6orqfgjmtqgd0tkc3b912i7.apps.googleusercontent.com'
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://XXXXX:XXXX@ds253537.mlab.com:53537/XXXXXXX'
};

process.env.URLDB = urlDB;
