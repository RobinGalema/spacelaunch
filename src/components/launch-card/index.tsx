import React from "react";
import './style.scss'

type Props = {
    data: any
}

class LaunchCard extends React.Component<Props> {
    time : string;
    dateString : string;

    constructor(props : Props){
        super(props);
        this.time = props.data.net;
        this.dateString = "";
    }

    formatDateString(date: Date){
        const month = (date.getMonth() > 9) ? date.getMonth() : `0${date.getMonth()}`;
        const day = (date.getDay() > 9) ? date.getDay() : `0${date.getDay()}`;
        const hour = (date.getHours() > 9) ? date.getHours() : `0${date.getHours()}`;
        const minute = (date.getMinutes() > 9) ? date.getMinutes() : `0${date.getMinutes()}`;
        return `${day}-${month}-${date.getFullYear()} | ${hour}:${minute}`;
    }

    componentDidMount() {
        const date = new Date(this.time);
        this.dateString = this.formatDateString(date);
    }

    render() {
        return(
            <div className="launchcard-wrapper">
                <div className="card-container">
                    <h3>{this.props.data.name}</h3>
                    <ul>
                        <li className="launch-time">{this.dateString}</li>
                        <li>{this.props.data.rocket.configuration.name}</li>
                        {this.props.data.mission ? <li>{this.props.data.mission.name}</li> : null }
                    </ul>
                </div>
            </div>
        )
    }
}

export default LaunchCard;