const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

const ASSETS = {
  image: {
    bg: "http://www.southernfriedscience.com/wp-content/uploads/2015/02/bioshock-rapture-city1.jpg",
    bigdaddy: "https://vignette3.wikia.nocookie.net/videogamefanon/images/c/ce/Render_big_daddy.png/revision/latest?cb=20140420234230",
  },
};
const SPEED = 4;
// phina.js をグローバル領域に展開
phina.globalize();

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit({
      width:SCREEN_WIDTH,
      height:SCREEN_HEIGHT,
    });
    // 背景色を指定
    this.backgroundColor = '#000000';

    this.bg = Sprite("bg",SCREEN_WIDTH,SCREEN_HEIGHT).addChildTo(this);
    this.bg.origin.set(0,0);
    // this.bg.setScale(0.8,1.3);

    this.player = Sprite('bigdaddy').addChildTo(this);
    this.player.setPosition(400,400);
    this.player.frameIndex = 0;


    // this.label = Label('Hello, phina.js!').addChildTo(this);
    // // ラベルを生成
    // this.label.x = this.gridX.center(); // x 座標
    // this.label.y = this.gridY.center(); // y 座標
    // this.label.fill = 'white'; // 塗りつぶし色
  },
  update: function(app){
    let p =app.pointer;
    if (p.getPointing()){
      let diff = this.player.x - p.x;
      if (Math.abs(diff) > SPEED){
        if (diff < 0){
          this.player.x += SPEED;
          this.player.scaleX = -1;
        }
        else{
          this.player.x -= SPEED;
          this.player.scaleX = 1;
        }

        if (app.frame % 4 === 0){
          this.player.frameIndex = (this.player.frameIndex ===12) ? 13:12;
        }
      }
    }
    else {
      this.player.frameIndex = 0;
    }
  }
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  const app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    fit : false,
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT,
    assets :ASSETS,
  });
  // アプリケーション実行
  app.run();
});
