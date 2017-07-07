const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT=600;

const ASSETS = {
  image: {
    bg: "Resources/BG.jpg",
    chest: "Resources/宝箱.png",
    chest_empty: "Resources/宝箱空.png",
    chest_gold: "Resources/宝箱金貨.png",
  },
};

const ipcRenderer = require('electron').ipcRenderer;

let button_c = false;
let button_d = false;
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

    this.bg = Sprite("bg",SCREEN_WIDTH,SCREEN_HEIGHT).addChildTo(this);
    this.bg.origin.set(0,0);

    const chest_L = Sprite('chest').addChildTo(this);
    const chest_R = Sprite('chest').addChildTo(this);
    chest_L.x= this.gridX.center(-3);
    chest_R.x= this.gridX.center(3);
    chest_L.y= chest_R.y = this.gridY.center(2);
    chest_L.width = chest_R.width = 220;
    chest_L.height = chest_R.height = 220;

    this.chest_L = chest_L;
    this.chest_R = chest_R;

    const animation_flag = 0;
    this.animation_flag = animation_flag;
    const selectLR = 0;
    this.selectLR = selectLR;
    // const chest_empty_R = Sprite('chest_empty').addChildTo(this);
    //
    // const chest_empty_L = Sprite('chest_empty').addChildTo(this);
    // chest_empty.x= this.gridX.center(-3);
    // chest_empty.y= this.gridY.center(2);
    // chest_empty.width = 220;
    // chest_empty.height = 220;
    // const chest_gold_L = Sprite('chest_gold').addChildTo(this);
    // const chest_gold_R = Sprite('chest_gold').addChildTo(this);
    //
    // chest_gold.x= this.gridX.center(+3);
    // chest_gold.y= this.gridY.center(2);
    // chest_gold.width = 220;
    // chest_gold.height = 220;

    // ラベルを生成
    this.label = Label('金貨の入った宝箱をあてよう！！').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(-4); // y 座標
    this.label.fontSize = 40,
    this.label.fill = 'white'; // 塗りつぶし色
  },


  update: function(app) {
    //ipc通信でシンクロできるぞ
    // console.log(ipcRenderer.sendSync('synchronous-message','ping'));

    // console.log(this.animation_flag);
    const keyboard = app.keyboard;
    // if(keyboard.getKey('a')){
    //   if(this.animation_flag == 0){
    //     this.animation_flag = 1;
    //     this.selectLR = 0;
    //   }
    // };
    //
    // if(keyboard.getKey('b')){
    //   if(this.animation_flag == 0){
    //     this.animation_flag = 1;
    //     this.selectLR = 1;
    //   }
    // };
    if (button_c){
      if(this.animation_flag == 0){
          button_c = false;
          this.animation_flag = 1;
          this.selectLR = 0;
      }
    }
    if (button_d){
      if(this.animation_flag == 0){
          button_d = false;
          this.animation_flag = 1;
          this.selectLR = 1;
      }
    }
    if(this.animation_flag == 1){
      this.animation_flag = 2;
      const LR = this.selectLR;
      let self;
      if (LR ==0){
        self = this.chest_L;
      }
      else{
        self = this.chest_R;
      }
      self.tweener
      .to({
        scaleX:1.3,
        scaleY:1.3,
      },150,'easeOutBounce')
      .to({
        scaleX:1,
        scaleY:1,
      },150,'easeInBounce')
      .wait(400)
      .to({
        scaleX:1.5,
        scaleY:1.5,
      },100,'easeInQuart')
      .call(function(){
        console.log("animation done")
        if (LR ==0){
          self.setImage("chest_empty",220,220);
        }
        else{
          self.setImage("chest_gold",220,220);
        }
      }).setLoop(false);

    }
  }
});
ipcRenderer.on('synchronous-message',(event,arg) => {
  console.log(arg);
  event.returnValue = 'pong';
  if (arg == 'c'){
    button_c = true;
  }
  if (arg == 'd'){
    button_d = true;
  }
})
// メイン処理
phina.main(function() {
  // アプリケーション生成
  const app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    assets:ASSETS,
    fit :true,
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});
