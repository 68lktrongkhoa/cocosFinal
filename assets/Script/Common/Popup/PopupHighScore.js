
cc.Class({
    extends: require("PopupItem"),

    properties: {
        content: cc.Node,
        highScoreCellPrefab: cc.Prefab,
        highScoreCellList: [require("HighScoreCell")],
    },

    onLoad(){
        for(let i = 0; i < 5; i++){
            const item = cc.instantiate(this.highScoreCellPrefab);
            item.parent = this.content;
            const highScoreCell = item.getComponent("HighScoreCell");
            this.highScoreCellList.push(highScoreCell);
        }
    },

    show(highScoreData){
        this._super();
        for(let i = 0; i < this.highScoreCellList.length; i++){
            if(i < highScoreData.length){
                this.highScoreCellList[i].setInfo(highScoreData[i]);
            } else {
                this.highScoreCellList[i].node.active = false;
            }
        }
    },
    
});
