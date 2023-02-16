import React, { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";

import "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  docRef,
  updateDoc,
  getDoc,
  getDocs,
  collectionGroup,
  where,
  query,
} from "firebase/firestore";

const Context = createContext();

export const StateContext = ({ children }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBTnYTK2Dol-vRzjG8GDevqmucXsB1smhE",
    authDomain: "michelin-strava.firebaseapp.com",
    projectId: "michelin-strava",
    storageBucket: "michelin-strava.appspot.com",
    messagingSenderId: "531936905950",
    appId: "1:531936905950:web:782aa2145036d69996504f",
    measurementId: "G-2PV75Y387Q",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const session = useSession();

  const [activityList, setActivityList] = useState([]);
  const [savedActivityList, setSavedActivityList] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [usersRankingDistance, setUsersRankingDistance] = useState([]);

  const handleAdd = (item) => {
    const checkActivity = activityList.find((el) => el.id === item.id);

    if (checkActivity) {
      setActivityList(
        activityList.filter((activity) => activity.id !== item.id)
      );

      setSavedActivityList((curr) => [...curr, item]);
    } else {
      setSavedActivityList(
        savedActivityList.filter((activity) => activity.id !== item.id)
      );

      setActivityList((curr) => [...curr, item]);
    }
    console.log(activityList);
  };

  const isInList = (item) => {
    return savedActivityList.find((el) => el.id === item.id);
  };

  const readActivities = async (userId, fetchedActivities) => {
    const docRef = doc(db, "activities", userId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    console.log("fetchedActivities", fetchedActivities);

    if (docSnap.exists()) {
      setSavedActivityList(docData.activities);

      const filteredArray = fetchedActivities.filter(
        (obj) =>
          !docData.activities.some(
            (otherObj) => obj.upload_id == otherObj.upload_id
          )
      );

      setActivityList(filteredArray);
      compareUsersDistance(activityList);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const readActivitiesForUser = async (userId) => {
    try {
      const docRef = doc(db, "activities", userId);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data();

      if (docSnap.exists()) {
        setSavedActivityList(docData.activities);
        console.log(savedActivityList);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const readRankings = async (userId) => {
    // setAllActivities([]);
    const querySnapshot = await getDocs(collection(db, "activities", userId));

    querySnapshot.forEach((doc) => {
      const userId = doc.id;
      const activities = doc.data().activities;

      const newActivities = [];
      activities.forEach((activity) => {
        if (!newActivities.some((e) => e.id === activity.id)) {
          newActivities.push(activity);
        }
      });

      setAllActivities(newActivities);
    });
  };

  const readAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "activities"));
    const usersList = querySnapshot.docs.map((e) => e.id);

    querySnapshot.docs.forEach((doc) => {
      const newUsers = [];
      usersList.forEach((user) => {
        if (!newUsers.some((e) => e === user)) {
          newUsers.push(user);
        }
      });
      setAllUsers(newUsers);
    });
  };

  const saveActivities = async (userId) => {
    try {
      const docRef = doc(db, "activities", userId);
      const docRef2 = doc(db, "infos", userId);
      await compareUsersDistance(savedActivityList);
      await compareUsersDays(savedActivityList);

      await setDoc(
        docRef,
        {
          activities: savedActivityList,
        },
        { merge: true }
      );

      await setDoc(
        docRef2,
        {
          traveledDistanceMonth: totalDistance,
          totalDaysMonth: totalDays,
          userName: session.data.user.name,
          avatar: session.data.user.image,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error updating activities: ", e);
    }
  };

  function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " ora, " : " ore, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minut, " : " minute, ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " secunda" : " secunde") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  function mToKms(distance) {
    if (distance >= 1000) {
      return (distance / 1000).toFixed(3) + " km";
    } else {
      return distance + " metrii";
    }
  }

  function formatDate(dateTime) {
    const date = new Date(dateTime);
    const month = date.toLocaleString("ro", { month: "short" });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${capitalizedMonth} ${day}, ${hours}:${minutes}`;
  }

  const compareUsersDistance = async (list) => {
    let total = 0;
    await list.forEach((e) => {
      total += e.distance;
    });

    setTotalDistance(total);

    return total;
  };

  const compareUsersDays = async (list) => {
    let datesList = [];

    list.forEach((e) =>
      datesList.push(
        `${new Date(e.start_date).getDate()} ${new Date(
          e.start_date
        ).getMonth()}`
      )
    );

    datesList = Array.from(new Set(datesList));

    setTotalDays(datesList.length);

    console.log("datesList", datesList.length);
  };

  const calculateDistanceTraveledForAllUsers = async () => {
    const infoRef = collection(db, "infos");

    const q = query(infoRef, where("traveledDistanceMonth", ">", 0));

    const querySnapshot = await getDocs(q);

    const distanceByUser = {};
    querySnapshot.forEach((doc) => {
      distanceByUser[doc.id] = doc.data();
    });

    const topUsers = Object.entries(distanceByUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, querySnapshot.size); // sort by distance traveled in descending order and slice array by length

    setUsersRankingDistance(distanceByUser);
    console.log("distanceByUser", distanceByUser);
  };

  return (
    <Context.Provider
      value={{
        session,
        activityList,
        totalDistance,
        allActivities,
        allUsers,
        usersRankingDistance,
        savedActivityList,
        setActivityList,
        handleAdd,
        isInList,
        saveActivities,
        readActivities,
        secondsToHms,
        mToKms,
        formatDate,
        compareUsersDistance,
        readRankings,
        readAllUsers,
        calculateDistanceTraveledForAllUsers,
        readActivitiesForUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
