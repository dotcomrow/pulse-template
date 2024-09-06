"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@hook/redux";
import { selectUser } from "@lib/features/user/userSlice";
import { useCookies } from "react-cookie";
import { CookieSetOptions } from "universal-cookie";

const Refresh = () => {
  const [cookies, setCookie] = useCookies(["token"]);

  const processResponse = () => {
    var fragmentString = window.location.hash.substring(1);
    var params: { [key: string]: string } = {};
    var regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(fragmentString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    window.location.hash = "";

    var options = {
      path: "/",
      expires: new Date(Date.now() + parseInt(params.expires_in) * 1000),
      secure: (window.location.protocol === "https:"),
      // httpOnly: true,
      sameSite: "lax"
    } as CookieSetOptions;

    if (!window.location.hostname.includes("localhost")) {
      options.domain = window.location.hostname;
      // options.httpOnly = true;
      options.sameSite = "lax";
    }

    setCookie("token", params.access_token, options);
  };

  useEffect(() => {
    processResponse();
    window.location.href = "/";
  }, []);

  return (
    <div>
      
    </div>
  );
};

export default Refresh;
