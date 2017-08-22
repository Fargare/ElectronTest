//Electron のモジュール
const electron = require('electron');
//アプリケーションをコントロールするモジュール
const app = electron.app;
//ウインドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');

///////////////xlsxファイル//////////////////////
const xlsx = require('xlsx');
let workbook = xlsx.readFile('ElectronTest/test.xlsx');
let sheetNames = workbook.SheetNames;
console.log(sheetNames);
let worksheet = workbook.Sheets['Sheet1'];
console.log(worksheet);

//コメント追加
let scene_PlayerA = 0;
let scene_PlayerB = 0;
let score = 0;
let gold = Math.floor(Math.random()*2);

let select_PlayerA = 0;
let select_PlayerB = 0;
//メインウインドウ

let mainWindow;
let secondWindow;

function createWindow () {
  ////////////////////////1Pウインドウ///////////////////
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame : false,
  });
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
  /////////////////////////////セカンドウインドウ///////////////////
  secondWindow = new BrowserWindow({
    width:800,
    height: 600,
    // frame:false,
  })
  secondWindow.loadURL(url.format({
    pathname:path.join(__dirname,'index2.html'),
    protocol:'file:',
    slashes:true
  }));
  // secondWindow.webContents.openDevTools();
  secondWindow.on('closed',function(){
    secondWindow = null;
  });
  ///////////////////////////////////////////
};

ipcMain.on('PlayerA',(event,arg) => {
  // console.log(scene_PlayerA,scene_PlayerB);
  scene_PlayerA = parseInt(arg);
  if (scene_PlayerB==scene_PlayerA &&(scene_PlayerA==1|| scene_PlayerA==4||scene_PlayerA==7)){
    event.returnValue = scene_PlayerA+1;
  }
  else{
    event.returnValue = scene_PlayerA;
  }
})
ipcMain.on('PlayerB',(event,arg) => {
  scene_PlayerB = parseInt(arg);
  if (scene_PlayerB==scene_PlayerA&&( scene_PlayerB==1 ||scene_PlayerB==4 || scene_PlayerB==7)){
    event.returnValue = scene_PlayerB+1;
  }
  else{
    event.returnValue = scene_PlayerB;
  }
  // console.log(gold,select_PlayerA,select_PlayerB);
})
ipcMain.on('AddScore',(event,arg) => {
  if (select_PlayerA == select_PlayerB){
    if (select_PlayerA == gold){
      if (parseInt(arg)==0){
        score += 10;
      }
      event.returnValue = "+10";
    }
    else{
      if (parseInt(arg)==0){
        score += 1;
      }
      event.returnValue = "+1";
    }
  }
  else{
    if (parseInt(arg)==0){
      score += 0;
    }
    event.returnValue = "はずれ！";
  }
})

ipcMain.on('UpdateScore',(event,arg) => {
  event.returnValue = score;
})
ipcMain.on('ResetGold',(event,arg) => {
  gold = Math.floor(Math.random()*2);
  console.log("gold:" + gold);
  event.returnValue = "Reset!";
})
ipcMain.on('UpdateGold',(event,arg) => {
  event.returnValue = gold;
})
ipcMain.on('SyncSelect_PlayerA',(event,arg) => {
  select_PlayerA= parseInt(arg);
  event.returnValue = "send";
})
ipcMain.on('SyncSelect_PlayerB',(event,arg) => {
  select_PlayerB= parseInt(arg);
  event.returnValue = "send";
})
ipcMain.on('Select_PlayerA',(event,arg) =>{
  event.returnValue = select_PlayerA;
})
ipcMain.on('Select_PlayerB',(event,arg) =>{
  event.returnValue = select_PlayerB;
})
app.on('ready', () => {
  globalShortcut.register('esc', () => {
    app.quit();
  })
  globalShortcut.register('F5', () => {
    console.log("relaunch");
    app.relaunch();
    app.exit(0);
  })
  globalShortcut.register('a', () => {
    mainWindow.webContents.send('synchronous-message','a');
  })
  globalShortcut.register('b', () => {
    mainWindow.webContents.send('synchronous-message','b');
  })
  ////////////////////////セカンドウインドウ
  globalShortcut.register('c', () => {
    secondWindow.webContents.send('synchronous-message','c');
  })
  globalShortcut.register('d', () => {
    secondWindow.webContents.send('synchronous-message','d');
  })
  ////////////////////////////////////////////////
})


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
