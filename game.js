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
    // console.log(this.animation_flag);
    const keyboard = app.keyboard;
    if(keyboard.getKey('a')){
      if(this.animation_flag == 0){
        this.animation_flag = 1;
      }
    };

    if(keyboard.getKey('b')){
      this.chest_R.setImage("chest_gold",220,220);
    };

    if(this.animation_flag == 1){
      this.animation_flag = 2;
      const self = this.chest_L;
      this.chest_L.tweener
      .to({
        scaleX:1.2,
        scaleY:1.2,
      },200,'easeOutBounce')
      .to({
        scaleX:1,
        scaleY:1,
      },200,'easeInBounce')
      .wait(500)
      .to({
        scaleX:1.2,
        scaleY:1.2,
      },200,'easeInQuart')
      .call(function(){
        console.log("animation done")
        self.setImage("chest_empty",220,220);
      }).setLoop(false);

    }
  }
});

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
