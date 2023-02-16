import { useStateContext } from "../../context/StateContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Activities from "../../components/Activities";

export default function userPage() {
  const { savedActivityList, readActivitiesForUser } = useStateContext();

  const router = useRouter();
  const userId = router.query.user;

  console.log(userId);

  useEffect(() => {
    readActivitiesForUser("userId1");
  }, []);

  return (
    <div>
      {" "}
      <Activities data={savedActivityList} />{" "}
    </div>
  );
}
