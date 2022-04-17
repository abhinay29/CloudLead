// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CockpitDash from "./CockpitDash";
import SubscribePlan from "./SubscribePlan";

const API_URL = process.env.REACT_APP_API_URL;

const Cockpit = () => {
  const [subscribed, setSubscribed] = useState("");

  const checkSubscription = async () => {
    let Subcription = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });
    let res = await Subcription.json();
    if (res.status) {
      setSubscribed("yes");
    } else {
      setSubscribed("no");
    }
  };

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/login");
      return false;
    }
    checkSubscription();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {subscribed === "no" && <SubscribePlan />}
      {subscribed === "yes" && <CockpitDash />}
    </>
  );
};

export default Cockpit;
