const mysql = require('mysql');
require('isomorphic-fetch');

class bddChatBot {
    constructor(host, user, password, database, port) {
        this._host = host;
        this._user = user;
        this._password = password;
        this._database = database;
        this._port = port;
    }

    connect() {
        var con = mysql.createConnection({
            host: this._host,
            user: this._user,
            password: this._password,
            database: this._database,
            port: this._port
        });
        return con;
    }

    getLastWeather() {
        var con = this.connect();
        return new Promise(function (resolve, reject) {
            // The Promise constructor should catch any errors thrown on
            // this tick. Alternately, try/catch and reject(err) on catch.
            con.connect(function (err) {
                console.log("Connected4!");
                if (err) {
                    return reject(err);
                }

                con.query("SELECT * FROM weatherhistory ORDER BY ID DESC LIMIT 1", function (err, result, fields) {
                    if (err) {
                        console.log(err);
                      return reject(err);
                    }
                    resolve(result);
                });

            });
        });
    }





    insertLastWeather(city, reponseAPI) {
        var con = this.connect();

        con.connect(function (err) {
            console.log("Connected1!");
            if (err) throw err;
            con.query("CREATE TABLE IF NOT EXISTS `weatherhistory` (`id` int(11) NOT NULL,`city` varchar(255) NOT NULL,`reponseAPI` varchar(500) NOT NULL) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
            /*
            con.query("ALTER TABLE `weatherhistory` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });
            con.query("ALTER TABLE `weatherhistory` ADD PRIMARY KEY (`id`)", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            });*/
            var sql = "INSERT INTO weatherhistory (city, reponseAPI) VALUES ('" + city + "', '" + reponseAPI + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
    }
};
module.exports.bddChatBot = bddChatBot;