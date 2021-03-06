'use stricts';
import React from "react";
import { render } from "react-dom";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content:'欢迎使用RX STREAM'
        };
    }
    
    componentDidMount() {
        setTimeout(() => {
        this.setState({
            content: '加载完毕'
        });
        }, 1000);
  }

    render() {
        return (
            <div className="main">
            {
                this.state.content ||''
            }
            </div>
        )
    }
};