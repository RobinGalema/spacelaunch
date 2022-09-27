import React from "react";
import './style.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

var format = require('date-format');

type Props = {
    data: any
}

class LaunchCard extends React.Component<Props> {
    time : string;
    dateString : string;
    timezoneOffset : string;

    constructor(props : Props){
        super(props);
        this.time = props.data.net;
        this.dateString = "";
        this.timezoneOffset = "";
    }

    componentDidMount() {
        const date = new Date(this.time);
        this.dateString = format('dd-MM-yyyy | hh:mm', date);
        this.timezoneOffset = format('O', date);
    }

    render() {
        return(
            <div className="launchcard-wrapper">
                <div className="card-container">
                    <h3>{this.props.data.name}</h3>
                    <ul>
                        <li className="launch-time">{this.dateString} <span className="time-zone">GMT{this.timezoneOffset}</span></li>
                        <li>{this.props.data.rocket.configuration.name}</li>
                        {this.props.data.mission ? <li>{this.props.data.mission.name}</li> : null }
                        <li className="location"><FontAwesomeIcon icon={faLocationDot} />{this.props.data.pad.name} |  <span className="base">{this.props.data.pad.location.name}</span></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default LaunchCard;