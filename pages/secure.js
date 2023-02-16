import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

const Secure = ({ session2 }) => {
  const [activities, setActivities] = useState(null);

  console.log("2", session2);

  const session = useSession();
  console.log(session);

  const getActivities = async () => {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?before=${endMonth}&after=${startMonth}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer f813662a9d84f4d5c6fed648861d10675510d84d`,
        },
      }
    )
      .then((res) => res.json())
      .then((asd) => {
        setActivities(asd);
      });
  };

  const startMonth = "1609462861";
  const endMonth = "1672534861";

  useEffect(() => {
    getActivities();
  }, []);

  // if (session.status === "unauthenticated") {
  //   return (
  //     <div>
  //       <p>Connect with strava so we can get your activities!</p>
  //       <button onClick={signIn}>Connect with strava</button>
  //     </div>
  //   );
  // }

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h1>Welcome {session.data ? session.data.user.name : "Not working"}</h1>

      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session2 = await getSession(context);

  if (!session2) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session2 },
  };
}

export default Secure;
