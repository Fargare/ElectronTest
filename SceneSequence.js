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
