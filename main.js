//Electron のモジュール
const electron = require('electron');
//アプリケーションをコントロールするモジュール
const app = electron.app;
//ウインドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

//コメント追加
<<<<<<< HEAD
//2回目
//3kaime
//4th challenge
//5th tablet commit
//6th tablet add
//7th test
//8th
//9th
//わりこみ
//10th from Laptop
//11th
//12th
//13th from openlan
=======
>>>>>>> ad31351f88b5bd42301f227deccf93ed1ae2a58a
//メインウインドウ

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 620,
    frame : false
  });

  //メインウインドウに表示するURLを指定します
  //（今回はmain.jsと同じディレクトリのindex.html）
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //デベロッパーツールの起動
  //mainWindow.webContents.openDevTools();

  //メインウインドウが閉じられたときの処理
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

//初期化が完了したときの処理
//ここで上で作られたcreateWindowが処理される
app.on('ready',createWindow);

//すべてのウインドウが閉じたときの処理
app.on('window-all-closed',function(){
  //macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
//アプリケーションがアクティブになったときの処理（macだと、dockがクリックされたとき）
app.on('activate',function(){
  ///メインウインドウが消えている場合は再度メインウインドウを作成する。
  if (mainWindow === null) {
    createWindow();
  }
});

/*varとconst(とlet)の違いについて
まず、スコープについて。スコープは変数や関数の有効範囲のこと
・グローバルスコープとローカルスコープ
グローバルスコープはプログラム上のどこからでも有効な範囲
ローカルスコープは関数の中でのみ有効な範囲
・ブロックスコープ
if文やfor文などのブロックのなかに限定の範囲

原則varは使わない。基本的にはconst
const:再宣言も再代入も不可
let:再宣言が不可
※constはオブジェクトで宣言した場合、オブジェクトの中身については再代入することができる。

srcの意味：ソース(Source)の略


*/


// // phina.js をグローバル領域に展開
// phina.globalize();
//
// // MainScene クラスを定義
// phina.define('MainScene', {
//   superClass: 'CanvasScene',
//   init: function() {
//     this.superInit();
//     // 背景色を指定
//     this.backgroundColor = '#444';
//     // ラベルを生成
//     this.label = Label('Hello, phina.js!').addChildTo(this);
//     this.label.x = this.gridX.center(); // x 座標
//     this.label.y = this.gridY.center(); // y 座標
//     this.label.fill = 'white'; // 塗りつぶし色
//   },
// });
//
// // メイン処理
// phina.main(function() {
//   // アプリケーション生成
//   var app = GameApp({
//     startLabel: 'main', // メインシーンから開始する
//   });
//   // アプリケーション実行
//   app.run();
// });
