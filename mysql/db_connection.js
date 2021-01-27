const mysql = require('mysql');
require('isomorphic-fetch');

class bddChatBot {
    constructor(host, user,password,database) {
        this._host = host;
        this._user = user;
        this._password = password;
        this._database = database;  
    }

    connect(){
        var con = mysql.createConnection({
            host: this._host,
            user: this._user,
            password:this._password,
            database: this._database
          });
          return con;
    }
    getLastWeather() {
        var con= this.connect();
        return new Promise(function(resolve, reject) {
            // The Promise constructor should catch any errors thrown on
            // this tick. Alternately, try/catch and reject(err) on catch.
            con.connect(function(err) {
                console.log("Connected!");
                if (err) {
                    return reject(err);
                }
                con.query("SELECT * FROM weatherhistory ORDER BY ID DESC LIMIT 1", function (err, result, fields) {
                    if (err) {
                        return reject(err);
                    }
                //  console.log(result);
                  resolve(result);
                }); 
            });
        });
    }
    insertLastWeather(city,reponseAPI) {
        var con= this.connect();
        con.connect(function(err) {
            console.log("Connected!");
            if (err) throw err;
            var sql = "INSERT INTO weatherhistory (city, reponseAPI) VALUES ('"+city+"', '"+reponseAPI+"')";
            con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
        });
    }
};
module.exports.bddChatBot = bddChatBot;