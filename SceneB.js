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
