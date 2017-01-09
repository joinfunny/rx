'use stricts';
var React = require("react");

var BaseModule = {
     getInitialState:function(){
        return {
            app:this.props.app
        }
    }
};

module.exports =  BaseModule;
