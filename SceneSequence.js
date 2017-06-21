phina.define("SceneSequence",{
  superClass: "phina.game.ManagerScene",

  init:function(){
    this.superInit({
      scenes:[
        {
          label:"シーンA",
          className:"SceneA",
        },

        {
          label:"シーンB",
          className:"SceneB",
          nexrLabel:"シーンA"
        }
      ]
    });
  }
});
phina.define("SceneA",{
  superClass:"phina.display.CanvasScene",
  init:function(){
    this.superInit();
    console.log("これはシーンAです");
  },
  update:funciton(app){
    if (app.pointing.getPointingEnd()){
      this.exit()
    }
  }
});
phina.define("SceneB",{
  superClass:"phina.display.CanvasScene",
  init:function(){
    this.superInit();
    console.log("これはシーンBです");
  },
  update:funciton(app){
    if (app.pointing.getPointingEnd()){
      this.exit()
    }
  }
});
