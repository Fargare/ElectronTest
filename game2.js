const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT=600;

const ASSETS = {
  image: {
    bg: "Resources/BG.jpg",
    chest: "Resources/宝箱.png",
    chest_empty: "Resources/宝箱空.png",
    chest_gold: "Resources/宝箱金貨.png",
    red_arrow: "Resources/red_arrow.png",
    blue_arrow:"Resources/blue_arrow.png",
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

    const blue_A = Sprite('blue_arrow').addChildTo(this);
    const red_A = Sprite('red_arrow').addChildTo(this);
    red_A.x = this.gridX.center(0.5);
    blue_A.x = this.gridX.center(-0.5);
    red_A.y = blue_A.y = this.gridY.center(6);
    red_A.width = blue_A.width = 100;
    red_A.height = blue_A.height = 100;
    red_A.alpha = 0.5;
    this.blue_A = blue_A;
    this.red_A = red_A;

    let score = 0;
    this.score = score;

    const scene = 0;
    this.scene = scene;
    const selectLR = 0;
    this.selectLR = selectLR;

    const gold = Math.randint(0,1);
    console.log("正解は:" + gold);
    this.gold = gold;

    const rounds = 0;

    // ラベルを生成
    this.label = Label('金貨の入った宝箱をあてよう！！').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(-4); // y 座標
    this.label.fontSize = 40,
    this.label.fill = 'white'; // 塗りつぶし色

    this.score_label = Label(this.score).addChildTo(this);
    this.score_label.x = this.gridX.center();
    this.score_label.y = this.gridY.center(-2);
    this.score_label.fontSize = 60;
    this.score_label.fill = 'yellow';
  },


  update: function(app) {
    this.score = ipcRenderer.sendSync('UpdateScore',0);
    this.score_label.text = this.score;

    // ipc通信でシンクロできるぞ
    // console.log(this.scene);
    // if (this.scene ==1){
    this.scene = parseInt(ipcRenderer.sendSync('PlayerB',this.scene));
    // };
    const animation_playing = (
      this.chest_L.tweener.playing ||
      this.chest_R.tweener.playing ||
      this.red_A.tweener.playing ||
      this.blue_A.tweener.playing
    )
    if (!animation_playing){
      // console.log(this.animation_flag);
      if (button_c){
        if(this.scene == 0){
          this.scene = 1;
          this.selectLR = 0;
          console.log(ipcRenderer.sendSync('SyncSelect_PlayerB',0));
          this.blue_A.tweener.clear()
          .to({
            x:this.gridX.center(-3),
          },150,'easeOutCubic').setLoop(false);
        }
        else if(this.scene == 3){
          this.scene = 4;
          this.selectLR = 0;
          console.log(ipcRenderer.sendSync('SyncSelect_PlayerB',0));
          this.blue_A.tweener.clear()
          .to({
            x:this.gridX.center(-3),
          },150,'easeOutCubic').setLoop(false);
        }
        else if(this.scene ==6){
          this.scene = 7;
          this.blue_A.tweener.clear()
          .to({
            x:this.gridX.center(-0.5),
          },150,'easeOutCubic').setLoop(false);
          this.red_A.tweener.clear()
          .to({
            x:this.gridX.center(0.5),
          },150,'easeOutCubic').setLoop(false);
        }
        button_c = false;
      }
      if (button_d){
        if(this.scene == 0){
            this.scene = 1;
            this.selectLR = 1;
            console.log(ipcRenderer.sendSync('SyncSelect_PlayerB',1));
            this.blue_A.tweener.clear()
            .to({
              x:this.gridX.center(3),
            },150,'easeOutCubic').setLoop(false);
        }
        else if(this.scene == 3){
          this.scene = 4;
          this.selectLR = 1;
          console.log(ipcRenderer.sendSync('SyncSelect_PlayerB',1));
          this.blue_A.tweener.clear()
          .to({
            x:this.gridX.center(3),
          },150,'easeOutCubic').setLoop(false);

        }
        else if (this.scene ==6){
          this.scene = 7;
          this.blue_A.tweener.clear()
          .to({
            x:this.gridX.center(-0.5),
          },150,'easeOutCubic').setLoop(false);
          this.red_A.tweener.clear()
          .to({
            x:this.gridX.center(0.5),
          },150,'easeOutCubic').setLoop(false);
        }
        button_d = false;
      }
      //決定フェイズ
      if (this.scene==2){
        this.scene=3;
        this.label.text = '相手の宣言をもとにもう一度選んでください';
        const red = parseInt(ipcRenderer.sendSync('Select_PlayerA',1))
        this.red_A.tweener.clear()
        .to({
          x:this.gridX.center((red-0.5)*6+1),
        },150,'easeOutCubic').setLoop(false);
      }


      //結果発表フェイズ
      if(this.scene == 5){
        this.gold = ipcRenderer.sendSync('UpdateGold',10);

        this.scene =6;
        const red = parseInt(ipcRenderer.sendSync('Select_PlayerA',1))
        this.red_A.tweener.clear()
        .to({
          x:this.gridX.center((red-0.5)*6-1),
        },150,'easeOutCubic').setLoop(false);

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
          self.label.text = ipcRenderer.sendSync('AddScore',1);
          if (self.selectLR == self.gold){
            chest.setImage("chest_gold",220,220);
          }
          else{
            chest.setImage("chest_empty",220,220);
          }
        }).setLoop(false);
      }

      if (this.scene == 8){
        this.scene = 0;
        this.label.text = '金貨がたくさん入っていると思う方を選んでください';

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
    button_c = false;
    button_d = false;
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
