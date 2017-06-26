// const SCREEN_WIDTH = 800;
// const SCREEN_HEIGHT = 600;

const ASSETS = {
  image: {
    bg: "http://www.southernfriedscience.com/wp-content/uploads/2015/02/bioshock-rapture-city1.jpg",
    bigdaddy: "https://vignette3.wikia.nocookie.net/videogamefanon/images/c/ce/Render_big_daddy.png/revision/latest?cb=20140420234230",
  },
};
// const SPEED = 4;
// // phina.js をグローバル領域に展開
phina.globalize();
//
const BLOCK_WIDTH = 40*2;
const BLOCK_HEIGHT = 60/2;
const PADDLE_WIDTH = BLOCK_WIDTH * 1.5;
const PADDLE_HEIGHT = BLOCK_HEIGHT;
const BALL_RADIUS = BLOCK_WIDTH /8;
//
//
// MainScene クラスを定義
phina.define('MainScene', {
  // 2016年のアップデートで"DisplayScene"から"CanvasScene"に変更
  superClass: 'CanvasScene',
  init: function() {
    // this.superInit({
    //   width:SCREEN_WIDTH,
    //   height:SCREEN_HEIGHT,
    // });
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'black';
    //
    // this.bg = Sprite("bg",SCREEN_WIDTH,SCREEN_HEIGHT).addChildTo(this);
    // this.bg.origin.set(0,0);
    // // this.bg.setScale(0.8,1.3);

    this.blockGroup = CanvasElement().addChildTo(this);
    this.dummyGroup = CanvasElement().addChildTo(this);

    const screenRect = Rect(0,0,640,960);

    //この後使う即時関数function内でblockGroup等を呼び出す際、thisを用いることができないため、名称をselfとして用意しておく。
    const self = this;
    //phina.jsにおけるArray
    //Array.range(開始、終了、ステップ数)
    //javascriptにおける即時関数 function(引数)　再利用されない関数のため、命名は不要。
    //今回の場合を整理すると、
    //X方向のグリッドに関する配列を宣言し(具体的には[2,4,6,8,10,12,14])、その中のそれぞれの値を引数とし、
    //Y方向のグリッドに関する配列を宣言する。こうすることで、2次元配列の各位置をspanX,spanYで指定できるようになる。
    Array.range(2,16,2).each(function(spanX){
      Array.range(1,4,0.5).each(function(spanY){
        //あらかじめ作っておいたblockGroupにspanX,spanYに対応するGridの位置をブロックを配置する場所として追加する。
        Block().addChildTo(self.blockGroup).setPosition(self.gridX.span(spanX),self.gridY.span(spanY));
      });
    });
    //※phina.jsにはデフォルトでGridが設定されている。Gridはスクリーンを格子状に分けており、
    //横方向、縦方向それぞれに16分割されている。

    const paddleY = this.gridY.span(14.5);
    const paddle = Paddle().addChildTo(this).setPosition(this.gridX.center(),paddleY);

    this.onpointmove = function(e){
      paddle.setPosition(e.pointer.x | 0,paddleY);
      //画面はみ出し防止
      if (paddle.left < screenRect.left){ paddle.left = screenRect.left;}
      if (paddle.right > screenRect.right) { paddle.right = screenRect.right;}
    };
    this.onpointend = function(){
      if (self.status === 'ready'){
        self.ball.vy = -self.ball.speed;
        self.status = 'move';
      }
    };

    //スコア
    this.score = 0;
    const scoreLabel = Label({
      text:this.score + '',
      fill: 'lime',
      fontSize:64,
    }).addChildTo(this);
    scoreLabel.setPosition(this.gridX.center(),this.gridY.center()+70);
    scoreLabel.alpha = 0.6;
    this.hitNumber = 0;
    //ヒット数表示を追加
    const hitLabel = Label({
      text:'',
      fill: 'red',
      fontSize:64,
    }).addChildTo(this);
    hitLabel.setPosition(this.gridX.center(),this.gridY.center()+140);

    this.ball = Ball().addChildTo(this);
    this.paddle = paddle;
    this.screenRect = screenRect;
    this.scoreLabel = scoreLabel;
    this.hitLabel = hitLabel;
    this.status = 'ready';
    // this.player = Sprite('bigdaddy').addChildTo(this);
    // this.player.setPosition(400,400);
    // this.player.frameIndex = 0;


    // this.label = Label('Hello, phina.js!').addChildTo(this);
    // // ラベルを生成
    // this.label.x = this.gridX.center(); // x 座標
    // this.label.y = this.gridY.center(); // y 座標
    // this.label.fill = 'white'; // 塗りつぶし色
  },
  update: function(){
    const ball = this.ball;
    const paddle = this.paddle;
    const screenRect = this.screenRect;
    //ボール待機中
    if (this.status === 'ready'){
      ball.vx = ball.vy = 0;
      ball.x = paddle.x;
      ball.bottom = paddle.top;
    }
    //ボール移動中
    if (this.status === 'move'){
      ball.moveBy(ball.vx,ball.vy);
      if (ball.top < screenRect.top){
        ball.top = screenRect.top;
        ball.vy = -ball.vy;
      }
      if (ball.left < screenRect.left){
        ball.left = screenRect.left;
        ball.vx = -ball.vx;
      }
      if (ball.right > screenRect.right){
        ball.right = screenRect.right;
        ball.vx = -ball.vx;
      }

      //落下
      const self = this;
      if (ball.top>screenRect.bottom){
        const label = Label({
          text:'GAME OVER',
          fill: 'yellow',
          fontSize: 64,
        }).addChildTo(this);
        label.setPosition(this.gridX.center(),this.gridY.center());
        //少し待ってからタイトル画面へ
        label.tweener.clear()
                      .wait(2000)
                      .call(function(){
                        self.nextLabel = 'title';
                        self.exit();
                      });
      }


      //パドルとの反射
      if (ball.hitTestElement(paddle) && ball.vy >0) {
        ball.bottom = paddle.top;
        ball.vy = -ball.vy;
        const dx = paddle.x-ball.x;
        ball.vx = -dx /5;
        this.hitNumber = 0;
        this.hitLabel.text = '';
      }

      this.blockGroup.children.some(function(block){
        if (ball.hitTestElement(block)){
          //左上かど
          if (ball.top< block.top && ball.left < block.left){
            ball.right = block.left;
            ball.bottom = block.top;
            ball.vx = -ball.speed;
            ball.vy = -ball.speed;
            self.disableBlock(block);
            return true;
          }
          //右上かど
          if (ball.top< block.top && block.right < ball.right){
            ball.left = block.right;
            ball.bottom = block.top;
            ball.vx = ball.speed;
            ball.vy = -ball.speed;
            self.disableBlock(block);
            return true;
          }
          //左下かど
          if (block.bottom< ball.bottom && ball.left < block.left){
            ball.right = block.left;
            ball.top = block.bottom;
            ball.vx = -ball.speed;
            ball.vy = ball.speed;
            self.disableBlock(block);
            return true;
          }
          //右下かど
          if (block.bottom < ball.bottom && block.right < ball.right){
            ball.left = block.right;
            ball.top = block.bottom;
            ball.vx = ball.speed;
            ball.vy = ball.speed;
            self.disableBlock(block);
            return true;
          }
          //左側
          if (ball.left < block.left){
            ball.right = block.left;
            ball.vx = -ball.vx;
            self.disableBlock(block);
            return true;
          }
          //右側
          if (block.right < ball.right){
            ball.left = block.right;
            ball.vx = -ball.vx;
            self.disableBlock(block);
            return true;
          }
          //上側
          if (ball.top < block.top){
            ball.bottom = block.top;
            ball.vy = -ball.vy;
            self.disableBlock(block);
            return true;
          }
          //下側
          if (block.bottom < ball.bottom){
            ball.top = block.bottom;
            ball.vy = -ball.vy;
            self.disableBlock(block);
            return true;
          }
        }
      })
    }
    //クリアチェック
    if (this.blockGroup.children.length ===0) {
      this.exit({
        score: this.score,
      });
    }
  },
  disableBlock: function(block){
    const dummy = Block().addChildTo(this.dummyGroup);

    dummy.x = block.x;
    dummy.y = block.y;

    block.remove();
    dummy.tweener.clear().to({scaleX:0.1,scaleY:0.1},200).call(function(){
      dummy.remove();
    });
    this.addScore();
  },
  addScore: function(){
    this.hitNumber++;
    this.score += this.hitNumber *10;
    this.scoreLabel.text = this.score;
    if (this.hitNumber>0){
      this.hitLabel.text = this.hitNumber+'Hit!!';
    }
    else{
      this.hitLabel.text = '';
    }
  }
});

phina.define('Block', {
  superClass:'RectangleShape',
  init:function(){
    this.superInit({
      width:BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
    });
  },
});

phina.define('Paddle',{
  superClass: 'RectangleShape',
  init:function(){
    this.superInit({
      width:PADDLE_WIDTH,
      height:PADDLE_HEIGHT,
      fill:'silver',
    });
  },
});
phina.define('Ball',{
  superClass:'CircleShape',
  init:function(){
    this.superInit({
      radius:BALL_RADIUS,
      fill:'silver',
    });
    this.speed = 6;
  },
});
// メイン処理
phina.main(function() {
  // アプリケーション生成
  const app = GameApp({
    //GameAppのコンストラクタに連想配列形式でパラメータを与える。
    // //連想配列形式：文字のキーをもとにして値を設定する配列。
    // startLabel: 'main', // メインシーンから開始する
    // fit : false,
    // width:SCREEN_WIDTH,
    // height:SCREEN_HEIGHT,
    // assets :ASSETS,
    //タイトルを追加（TitleSceneに表示されるタイトル名）
    title:'Break Out',
  });
  app.fps = 60;
  // アプリケーション実行
  app.run();
});
