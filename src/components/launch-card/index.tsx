import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import FavoriteContext from "../../context/FavoriteContext";

var format = require("date-format");

type Props = {
  data: any;
  id: string;
};

export const LaunchCard = (props: Props) => {
  const time = props.data.net;
  let dateString = "";
  let timezoneOffset = "";
  const id = props.id;

  const context = useContext(FavoriteContext);

  const [launchTime, setLaunchTime] = useState(<></>);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    getTime();

    const storedFavorites = Array.from(
      JSON.parse(localStorage.getItem("favorites") || "{}")
    );
    if (storedFavorites.includes(id)) {
      setIsFavorite(true);
      console.log(id, "is a favorite");
    }
  }, []);

  const getTime = () => {
    const date = new Date(time);
    dateString = format("dd-MM-yyyy @ hh:mm", date);
    timezoneOffset = format("O", date);

    setLaunchTime(
      <p>
        {" "}
        {dateString} <span className="time-zone">(GMT{timezoneOffset})</span>
      </p>
    );
  };

  const toggleFavorite = () => {
    let storedFavorites = Array.from(
      JSON.parse(localStorage.getItem("favorites") || "{}")
    );

    if (isFavorite) {
      const index = storedFavorites.indexOf(id);
      if (index > -1) storedFavorites.splice(index, 1);

      // Update global state
      context.setFavorites(storedFavorites);

      localStorage.setItem("favorites", JSON.stringify(storedFavorites));

      // Set state
      setIsFavorite(false);
    } else if (!isFavorite) {
      let newArray = [...storedFavorites, ...[id]];
      localStorage.setItem("favorites", JSON.stringify(newArray));

      // Set state
      setIsFavorite(true);

      // Upate global state
      context.setFavorites(newArray);
    }
  };

  return (
    <Col xs={12} md={6} className="launchcard-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ease: "easeOut", duration: 0.5 }}
        className="motion-container"
      >
        <div className="card-container">
          <div className="card-left">
            <div
              className="image-container"
              style={{ backgroundImage: `url("${props.data.image}")` }}
            />
          </div>
          <div className="card-right">
            <div className="content">
              <div className="title">
                <h3>{props.data.name}</h3>
              </div>
              <div className="time">{launchTime}</div>
              <div className="rocket">
                <p>{props.data.rocket.configuration.name}</p>
              </div>
              <div className="location">
                <FontAwesomeIcon icon={faLocationDot} />{" "}
                <span className="base">{props.data.pad.location.name}</span>
              </div>
            </div>
            <button
              className={isFavorite ? "favorite favorited" : "favorite"}
              onClick={toggleFavorite}
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          </div>
        </div>
      </motion.div>
    </Col>
  );
};
