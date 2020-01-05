'use strict';

export default {
    name: "Cell",
    props: ['value'],
    data() {
        return {
            images: {
                smallsnow: require('../../../../assets/smallsnow.png'),
                mediumsnow: require('../../../../assets/mediumsnow.png'),
                mediumsmallsnow: require('../../../../assets/mediumsmallsnow.png'),
                bigsnow: require('../../../../assets/bigsnow.png'),
                bigmediumsnow: require('../../../../assets/bigmedium.png'),
                bigsmallsnow: require('../../../../assets/biglittle.png'),
                snowman: require('../../../../assets/snowmanfull.png'),
                player: require('../../../../assets/playerBaton.png'),
            }
        }
    },
    computed: {
        imgsrc: function() {
            switch(this.value){
                case 1:
                    return this.images.player;
                case 2:
                    return this.images.smallsnow;
                case 3:
                    return this.images.mediumsnow;
                case 4:
                    return this.images.bigsnow;
                case 5:
                    return this.images.mediumsmallsnow;
                case 6:
                    return this.images.bigsmallsnow;
                case 7:
                    return this.images.bigmediumsnow;
                case 9:
                    return this.images.snowman;
            }
        }
    }
}