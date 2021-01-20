const { URL } = require('url');
require('isomorphic-fetch');
let querystring = require('querystring');

class GoogleTraductionAPI {
    constructor(client, dt) {
        this._client = client; //gtx
        this._dt = dt; //t
    }

    getTranslate1(phrase, source , cible ) {
        const urlow = new URL("https://translate.googleapis.com/translate_a/single?"),
        params = { client:this._client, sl: source, tl: cible, dt: this._dt, q: phrase}
        Object.keys(params).forEach(key => urlow.searchParams.append(key, params[key]))
        let options = {};
        return fetch(urlow.toString(), options)
            .then(response => response.json())
    }

     async getTranslate2( phrase, source , cible ) {
      const urlow = new URL("https://translate.googleapis.com/translate_a/single?"),
      params = { client:this._client, sl: source, tl: cible, dt: this._dt, q: phrase}
      Object.keys(params).forEach(key => urlow.searchParams.append(key, params[key]))
      let options = {};
      const response = await fetch ( urlow.toString(), options ) ;
      return response.json () ;
      }
};

module.exports.GoogleTraductionAPI = GoogleTraductionAPI;         