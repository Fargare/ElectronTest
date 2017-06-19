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
