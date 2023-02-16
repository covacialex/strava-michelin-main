import React from "react";
import { useState } from "react";
import Activity from "./Activity";
import { useStateContext } from "../context/StateContext";
import { signIn } from "next-auth/react";

const Activities = ({ data }) => {
  // const [activityList, setActivityList] = useState([]);
  // //   console.log(data);

  // const handleAdd = (item) => {
  //   const checkActivity = activityList.find((el) => el.id === item.id);

  //   if (checkActivity) {
  //     console.log("Already in list");
  //   } else {
  //     setActivityList((curr) => [...curr, item]);
  //   }
  //   console.log(activityList);
  // };

  const { activityList, setActivityList, handleAdd, isInList } =
    useStateContext();

  return (
    <div>
      <h3>Lista cu activitati de la Strava {data.length} </h3>
      <ul className="activity_list">
        {!data.errors
          ? data.map((activity) => (
              <>
                <Activity key={activity.id} activity={activity} />

                <div>
                  <button
                    className="activity__button"
                    onClick={() => handleAdd(activity)}
                  >
                    {isInList(activity)
                      ? "Sterge din lista"
                      : "Adauga in lista"}
                  </button>
                  <button className="activity__button">
                    <a
                      href={`https://www.strava.com/activities/${activity.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Vezi activitatea
                    </a>
                  </button>
                </div>

                {/* <button
                  className="activity__button"
                  onClick={() => handleRemove(activity)}
                >
                  Sterge din lista
                </button> */}
              </>
            ))
          : signIn()}
      </ul>
    </div>
  );
};

export default Activities;
