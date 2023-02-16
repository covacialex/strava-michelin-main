import React from "react";
import { signIn, getSession } from "next-auth/react";

const login = () => {
  return (
    <div>
      <p>Connect with strava so we can get your activities!</p>
      <button onClick={signIn}>Connect with strava</button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default login;
