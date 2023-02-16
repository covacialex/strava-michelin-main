import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import Activities from "./Activities";
import ActivityList from "./ActivityList";
import { useStateContext } from "../context/StateContext";

const Hompeage = () => {
  const [activities, setActivities] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const session = useSession();

  const {
    activityList,
    saveActivities,
    savedActivityList,
    readActivities,
    compareUsersDistance,
  } = useStateContext();

  // Check if token expired
  useEffect(() => {
    if (!session.data.accessToken && !session.user) {
      signIn(); // Force sign in
    } else {
      // readActivities(session.data.user.id); // Read activities based on strava userID
      data && readActivities("userId2", data);

      setIsLoading(false);
    }
  }, [session]);

  const fetcher = (url, token) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((r) => {
      return r.json();
    });

  // They're called epoch timestamps.
  const startMonth = "1672578061";
  const endMonth = "1677675661";

  const { data, error } = useSWR(
    [
      `https://www.strava.com/api/v3/athlete/activities?before=${endMonth}&after=${startMonth}`,
      session.data.accessToken,
    ],
    fetcher
  );

  data && console.log("activityList", data);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="container__user">
        <img src={session.data.user.image} className="container__user-img" />
        <h1 className="container__user-name">
          Bun venit {session.data ? session.data.user.name : "Not working"}
        </h1>
      </div>

      <h3>Activitatile din intervalul Ianuarie-Februarie 2023</h3>
      <div className="container__data">
        {data && <Activities data={activityList != 0 ? activityList : data} />}
        {/* <ActivityList /> */}
        {data && savedActivityList != 0 ? (
          <Activities data={savedActivityList} />
        ) : (
          <p>Start adding some activities</p>
        )}
      </div>

      <button className="button" onClick={() => console.log(savedActivityList)}>
        Sign out
      </button>
      <button className="button" onClick={() => saveActivities("userId2")}>
        Actualizati lista
      </button>
      <button className="button" onClick={() => readActivities("userId2")}>
        Read activities
      </button>
    </div>
  );
};

export default Hompeage;
