const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT=600;

const five = require("johnny-five");
const board = new five.Board();
const button;

board.on("ready", function() {
  console.log("ready");
  // スイッチの設定
  button = new five.Button({
    // デジタル2番ピンにスイッチを接続
    pin: 6,
    // Arduinoに内蔵されているプルアップ回路を有効
    isPullup: true
  });

  // スイッチを追加(アクセス許可)
  board.repl.inject({
    button: button
  });

  // スイッチを押した
  button.on("down", function() {
    console.log("HIGH");
  });

  // スイッチを押し続けて一定時間(初期設定では500ms)経過した
  button.on("hold", function() {
    console.log("HOLD");
  });

  // スイッチを離した
  button.on("up", function() {
    console.log("LOW");
  });
});



const ASSETS = {
  image: {
    bg: "http://www.southernfriedscience.com/wp-content/uploads/2015/02/bioshock-rapture-city1.jpg",
    chest: "http://clipartwork.com/wp-content/uploads/2017/02/of-a-treasure-chest-free-download.png",
  },
};

// phina.js をグローバル領域に展開
phina.globalize();

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit({
      width:SCREEN_WIDTH,
      height:SCREEN_HEIGHT,
    });
    // 背景色を指定
    this.backgroundColor = '#ffffff';
    // ラベルを生成
    this.label = Label('Hello, phina.js!').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(); // y 座標
    this.label.fill = 'black'; // 塗りつぶし色
  },
  update: function(app) {

  }
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  const app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    fit :true,
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});
