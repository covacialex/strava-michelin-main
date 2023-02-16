import React from "react";
import { useStateContext } from "../context/StateContext";

const ActivityList = () => {
  const { activityList, totalDistance } = useStateContext();
  return (
    <div>
      <h3>Lista cu activitatile salvate in baza de date</h3>
      <p>Distanta totala: {totalDistance}</p>
      {activityList.map((el) => (
        <p key={el.id}>{el.name}</p>
      ))}
    </div>
  );
};

export default ActivityList;
