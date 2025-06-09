
cc.Class({
    extends: require("PopupItem"),

    properties: {
        content: cc.Node,
        highScoreItemPrefab: cc.Prefab,
        highScoreItemList: [require("HighScoreItem")],
    },

    onLoad(){
        for(let i = 0; i < 5; i++){
            const item = cc.instantiate(this.highScoreItemPrefab);
            item.parent = this.content;
            const highScoreItem = item.getComponent("HighScoreItem");
            this.highScoreItemList.push(highScoreItem);
        }
    },

    show(highScoreData){
        this._super();
        for(let i = 0; i < this.highScoreItemList.length; i++){
            if(i < highScoreData.length){
                this.highScoreItemList[i].setInfo(highScoreData[i]);
            } else {
                this.highScoreItemList[i].node.active = false;
            }
        }
    },
    
});
