
// framework include
var http = require('http');
var Express = require('express');

// local include
var Config = require('./config.js');

// Ark
var Client = require('./client.js');
var LoginRoom = require('./login_room.js');
var MatchingRoom = require('./matching_room.js');
var BattleRoom = require('./battle_room.js');

// initialization
var app = Express();
var server = http.createServer(app);


var ws = require('socket.io');



var loginRoom = new LoginRoom();
var matchingRoom = new MatchingRoom();
var battleRoom = new BattleRoom();

//var battleClients = [];
loginRoom.onExit = function(client) {
    /*
    battleClients.push(client);
    if (battleClients.length == 2) {
        battleClients[0].enemyClient = battleClients[1];
        battleClients[1].enemyClient = battleClients[0];
    }
    */
    client.currentRoom = matchingRoom;
};

matchingRoom.onExit = function(clients) {
    clients.forEach(function(client) {
        client.currentRoom = battleRoom;
    });
    battleRoom.enter(clients);
};

battleRoom.onExit = function(client) {
      client.currentRoom = matchingRoom;
};


/*
// TODO: URLのルーティングの設定(URLに対応するコールバック関数を割り当てる)
//  書式: router.get(URLのパス, コールバック関数())  ※POSTを受け取る場合はpostメソッドで指定
var router = Express.Router();

// ルートディレクトリがGETされた時のコールバック関数を設定
router.get('/',function(request,response) {
  console.log('/ が GETされた');

  // テンプレートエンジンを使って表示
  // 書式: response.render(viewsの中にあるファイルを指定, 表示で使用する変数をまとめたオブジェクト)
  response.render('index.ejs', {reqType: 'GET', foo: 1, bar: 2}); // viewsディレクトリのindex.ejsを表示

});

// ルートディレクトリがPOSTされた時のコールバック関数を設定
router.post('/',function(request,response) {
  console.log('/ が POSTされた');

  // テンプレートエンジンを使って表示
  // 書式: response.render(viewsの中にあるファイルを指定, 表示で使用する変数をまとめたオブジェクト)
  response.render('index.ejs', {reqType: 'POST'}); // viewsディレクトリのindex.ejsを表示

});

// 試しに/fooも設定してみます
router.get('/foo',function(request,response) {
  console.log('/foo が GETされた');
  response.render('foo.ejs', {}); // viewsディレクトリのfoo.ejsを表示
});

// 作成したルーティングをExpressに反映
//  (ルータの入れ子もできます: 例.router.use('/', anothorRouter))
app.use('/', router);
*/

var formatDateTimeString = function(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var w = date.getDay();
    // var wNames = ['日', '月', '火', '水', '木', '金', '土'];

    if (m < 10) {
      m = '0' + m;
    }
    if (d < 10) {
      d = '0' + d;
    }

    var hour = (date.getHours() + 9) % 24;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    return y + '/' + m + '/' + d + ' ' + hour + ':' + minute + ':' + second;
};

var wsServer = ws.listen(server);

wsServer.on('connection', function(socket) {
    var d = new Date();
    d.setHours(d.getHours() + 9);
    console.log('connected!! : ' + formatDateTimeString(d) + ' addr=' + socket.conn.remoteAddress);

    var client = new Client(socket);
    client.currentRoom = loginRoom;

    socket.on('disconnect', function() {
        client.onDisconnect();
            client = null;
            console.log('disconnection....');
    });


    socket.on('error', function(err) {
        console.log('client-socket ERROR');
        console.log(err);
    });

    socket.on('message', function(data) {
        console.log('message: ' + data);

        // try {
              var message = JSON.parse(data);
              if (message) {
                    console.log('' + client.name + ': [' + message.type + ']');
                    console.log('  data:' + data);
                    client.onMessage(message.type, message.args);
              }
        // } catch (err) {
        //       console.log('-------------------------');
        //       console.log('message Error....');
        //       console.log(err);
        // }
    });
});

wsServer.on('error', function(err) {
    console.log('ERR');
    console.log(err);
});

// テンプレートエンジンの指定
//  Expressで使用できるテンプレートエンジンは色々ありますが、ejsを指定してみます。
app.set('view engine', 'ejs');

// 公開ディレクトリ指定(画像やcssを置く)
//  書式: use(URLのパス, Express.static(サーバのディレクトリ))
app.use('/', Express.static('./public'));


// サーバスタート
server.listen(Config.port, function() {
    console.log('Server listening on port ' + Config.port + '!');
});
