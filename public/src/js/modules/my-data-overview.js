'use stricts';
var React = require("react");
var ModuleBase = require("./base");

var MyDataOverview = React.createClass({
    maxin:[ModuleBase],
    getDefaultProps:function(){

    },
    render:function(){
        return (<div className="header-data-count">数据总数：<span>{this.state.realTimeCount>0?this.state.realTimeCount:'--'}</span></div>);
    }
});

module.exports = MyDataOverview;