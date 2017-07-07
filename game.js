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

let button_a = false;
let button_b = false;

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

    const gold = Math.randint(0,1);
    console.log("正解は:" + gold);
    this.gold = gold;

    const rounds = 0;

    const score = 0;
    this.score = score;

    // ラベルを生成
    this.label = Label('金貨の入った宝箱をあてよう！！').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(-4); // y 座標
    this.label.fontSize = 40,
    this.label.fill = 'white'; // 塗りつぶし色

    this.score_label = Label(this.score).addChildTo(this);
    this.score_label.x = this.gridX.center();
    this.score_label.y = this.gridY.center(-2);
    this.score_label.fontSize = 50;
    this.score_label.fill = 'yellow';

  },


  update: function(app) {
    this.score_label.text = this.score;
    //ipc通信でシンクロできるぞ
    // console.log(ipcRenderer.sendSync('synchronous-message','ping'));
    const keyboard = app.keyboard;

    if (button_a){
      if(this.animation_flag == 0 && (this.chest_L.tweener.playing == false || this.chest_R.tweener.playing == false)){
        this.animation_flag = 1;
        this.selectLR = 0;
      }
      if (this.animation_flag ==2 && (this.chest_L.tweener.playing == false || this.chest_R.tweener.playing == false)){
        console.log("animtion 2->3")
        this.animation_flag = 3;
      }
      button_a = false;
    }
    if (button_b){
      if(this.animation_flag == 0 && (this.chest_L.tweener.playing == false || this.chest_R.tweener.playing == false)){
          this.animation_flag = 1;
          this.selectLR = 1;
      }
      if (this.animation_flag ==2 && (this.chest_L.tweener.playing == false || this.chest_R.tweener.playing == false)){
        console.log("animtion 2->3")
        this.animation_flag = 3;
      }
      button_b = false;

    }

    if(this.animation_flag == 1){
      this.animation_flag = 2
      self = this;
      let chest;
      if (self.selectLR ==0){
        chest = this.chest_L;
      }
      else{
        chest = this.chest_R;
      }
      chest.tweener.clear()
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
        // console.log("animation done")
        if (self.selectLR == self.gold){
          chest.setImage("chest_gold",220,220);
          self.score +=10;
        }
        else{
          chest.setImage("chest_empty",220,220);
          self.score ++;
        }
      }).setLoop(false);
    }

    if (this.animation_flag == 3){
      this.animation_flag = 0;
      this.gold = Math.randint(0,1);
      console.log("正解は:" + this.gold);

      for(let i = 0; i < 2; i++){
        let self;
        if (i == 0){
          self = this.chest_L;
        }
        else if (i==1) {
          self = this.chest_R;
        }
        self.tweener.clear()
        .wait(500)
        .to({
          scaleX:0,
          scaleY:0,
        },200)
        .wait(1000)
        .call(function(){
          self.setImage("chest",220,220);
        })
        .to({
          scaleX:1,
          scaleY:1,
        },200)
        .setLoop(false);
      }
    }
  }
});
ipcRenderer.on('synchronous-message',(event,arg) => {
  console.log(arg);
  event.returnValue = 'pong';
  if (arg == 'a'){
    button_a = true;
  }
  if (arg == 'b'){
    button_b = true;
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
