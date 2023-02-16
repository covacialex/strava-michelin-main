import React, { useState } from "react";
import { useStateContext } from "../context/StateContext";

const Activity = ({ activity }, onAdd) => {
  //   const [activityList, setActivityList] = useState([]);

  // const handleAdd = (item) => {
  //   // const checkActivityInList = activityList.find((el) => {
  //   //   return el.id === item.id;
  //   // });
  //   // if (checkActivityInList) {
  //   //   console.log(activityList);
  //   // } else {
  //   //   setActivityList((prev) => [...prev, item]);
  //   // }

  //   return setActivityList((curr) => [...curr, item]);
  // };

  const { isInList, secondsToHms, mToKms, formatDate } = useStateContext();

  return (
    <li
      className={
        isInList(activity) ? "activity_item-green" : "activity_item-blue"
      }
      key={activity.id}
    >
      <div className="activity_field">
        <div className="activity_info">
          <h4 className="activity_name">{activity.name}</h4>
          <p>Data: {formatDate(activity.start_date_local)}</p>
        </div>
        <div className="activity_info">
          <p className="activity_movingtime">
            Timp deplasat: {secondsToHms(activity.moving_time)}
          </p>
          <p className="activity_distance">
            Distanta parcursa: {mToKms(activity.distance)}
          </p>
        </div>
      </div>
      <a
        href={`https://www.strava.com/activities/${activity.id}`}
        target="_blank"
        rel="noreferrer"
      >
        Vezi activitatea
      </a>
    </li>
  );
};

export default Activity;
