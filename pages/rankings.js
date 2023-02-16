import { useStateContext } from "../context/StateContext";
import { useEffect } from "react";
import Link from "next/link";

export default function Rankings() {
  // if (Object.keys(session) === 0) console.log("no session");

  const {
    session,
    readRankings,
    allActivities,
    totalDistance,
    compareUsersDistance,
    allUsers,
    readAllUsers,
    calculateDistanceTraveledForAllUsers,
    usersRankingDistance,
    mToKms,
  } = useStateContext();

  useEffect(() => {
    // readAllUsers();
    calculateDistanceTraveledForAllUsers();
  }, []);

  // const calcTotalDistance = (list, id) => {
  //   console.log(id);
  //   list.forEach((e) => console.log(e.distance));
  // };

  const rankingValues = [];

  for (const userId in usersRankingDistance) {
    const user = usersRankingDistance[userId];
    rankingValues.push(user);
  }

  // sort the userValues array based on the traveledDistanceMonth property
  const distanceRankings = rankingValues.sort(
    (a, b) => b.traveledDistanceMonth - a.traveledDistanceMonth
  );

  const daysRankings = rankingValues.sort(
    (a, b) => b.totalDaysMonth - a.totalDaysMonth
  );

  console.log("daysRankings", session);

  return (
    <div>
      <p>Distante parcurse</p>
      <button onClick={() => console.log(usersRankingDistance)}>Test</button>
      <div className="rankings__lists">
        <div>
          <h3>Kilometri totali parcursi cu bicicleta luna aceasta</h3>
          {distanceRankings.map((user, index) => {
            console.log(usersRankingDistance);
            return (
              <div key={index} className="rankings__container">
                <img src={user.avatar} className="rankings__photo" />
                <p className="rankings__name">{user.userName}</p>
                <p className="rankings__distance">
                  {mToKms(user.traveledDistanceMonth)}
                </p>
                <Link href={`user/${session.data.user.id}`}>User Page</Link>
              </div>
            );
          })}
        </div>

        <div>
          <h3>Total zile verzi parcurse </h3>
          {daysRankings.map((user, index) => {
            console.log(usersRankingDistance);
            return (
              <div key={index} className="rankings__container">
                <img src={user.avatar} className="rankings__photo" />
                <p className="rankings__name">{user.userName}</p>
                <p className="rankings__distance">
                  {user.totalDaysMonth} zile verzi
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
