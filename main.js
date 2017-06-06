const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

//コメント追加
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
//メインウインドウ
let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({width: 800,height: 600});

  //メインウインドウに表示するURLを指定します
  //（今回はmain.jsと同じディレクトリのindex.html）
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //デベロッパーツールの起動
  mainWindow.webContents.openDevTools();

  //メインウインドウが閉じられたときの処理
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

//初期化が完了したときの処理
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
