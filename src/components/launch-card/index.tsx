import React from "react";
import './style.scss'
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

var format = require('date-format');

type Props = {
    data: any
    id : string
}

class LaunchCard extends React.Component<any, any> {
    time : string;
    dateString : string;
    timezoneOffset : string;
    id : string

    constructor(props : Props){
        super(props);
        this.time = props.data.net;
        this.dateString = "";
        this.timezoneOffset = "";
        this.id = props.id;

        this.state = {
            time : false,
            isFavorite : false
        }
    }

    componentDidMount() {
        this.getTime();

        const storedFavorites = Array.from(JSON.parse(localStorage.getItem("favorites") || "{}"));
        if (storedFavorites.includes(this.id)) this.setState({isFavorite : true});
    }

    getTime = () => {
        const date = new Date(this.time);
        this.dateString = format('dd-MM-yyyy @ hh:mm', date);
        this.timezoneOffset = format('O', date);

         this.setState({time : (<p className="launch-time"> {this.dateString} <span className="time-zone">(GMT{this.timezoneOffset})</span></p>)});
    }

    toggleFavorite = () => {
        let storedFavorites =  Array.from(JSON.parse(localStorage.getItem("favorites") || "{}"));

        if (this.state.isFavorite){
            const index = storedFavorites.indexOf(this.id);
            if (index > -1) storedFavorites.splice(index, 1);

            localStorage.setItem("favorites", JSON.stringify(storedFavorites));

            // Set state
            this.setState({isFavorite : false})
        }
        else if (!this.state.isFavorite ){
            let newArray = [...storedFavorites, ...[this.id]]
            localStorage.setItem("favorites", JSON.stringify(newArray));

            // Set state
            this.setState({isFavorite : true})
        }
    }

    render() {
        const { time, isFavorite } = this.state;

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
                        <button className={isFavorite ? "favorite favorited" : "favorite"} onClick={this.toggleFavorite}><FontAwesomeIcon icon={faStar} /></button>
                    </div>
                </div>
            </Col>
        )
    }
}

export default LaunchCard;