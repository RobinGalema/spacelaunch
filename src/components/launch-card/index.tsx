import React from "react";
import './style.scss'
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { isJsxElement } from "typescript";

var format = require('date-format');

type Props = {
    data: any
}

class LaunchCard extends React.Component<any, any> {
    time : string;
    dateString : string;
    timezoneOffset : string;

    constructor(props : Props){
        super(props);
        this.time = props.data.net;
        this.dateString = "";
        this.timezoneOffset = "";

        this.state = {
            time : false
        }
    }

    componentDidMount() {
        this.getTime();
    }

    getTime = () => {
        const date = new Date(this.time);
        this.dateString = format('dd-MM-yyyy @ hh:mm', date);
        this.timezoneOffset = format('O', date);

         this.setState({time : (<p className="launch-time"> {this.dateString} <span className="time-zone">(GMT{this.timezoneOffset})</span></p>)});
    }

    render() {
        const { time } = this.state;

        return(
            <Col xs={12} md={6} className="launchcard-wrapper">
                <div className="card-container">
                    <div className="card-left">
                        <div className="image-container" style={{backgroundImage : `url("${this.props.data.image}")` }} />
                    </div>
                    <div className="card-right">
                        <div className="content">
                            <div className="title">
                                <h3>{this.props.data.name}</h3>
                            </div>
                            <div className="time">
                                { time }
                            </div>
                            <div className="rokcet">
                                <p>{this.props.data.rocket.configuration.name}</p>
                            </div>
                            <div className="location">
                                <FontAwesomeIcon icon={faLocationDot} /> <span className="base">{this.props.data.pad.location.name}</span>
                            </div>
                        </div>
                        <button className="info"><FontAwesomeIcon icon={faCircleInfo} /></button>
                    </div>
                </div>
            </Col>
        )
    }
}

export default LaunchCard;