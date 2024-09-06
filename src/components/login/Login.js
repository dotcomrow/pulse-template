"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@hook/redux";
import { selectUser } from "@lib/features/user/userSlice";


const Login = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const STATE = "state";
  let googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  let googleClientId =
    "488218567442-uj3hsd9g13so40fgc89srllfeoiuqeer.apps.googleusercontent.com";

  

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", googleAuthUrl);
    // Parameters to pass to OAuth 2.0 endpoint.
    if (localStorage.getItem(STATE)) {
      localStorage.removeItem(STATE);
    }
    var now = new Date();
    localStorage.setItem(STATE, now.getTime());
    var params = {
      client_id: googleClientId,
      redirect_uri: window.location.protocol + "//" + window.location.host + "/authCallback",
      scope: "email profile openid",
      state: localStorage.getItem(STATE),
      include_granted_scopes: "true",
      response_type: "token",
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };

  



  // useEffect(() => {
  //   const params = processResponse();
  //   if (params["access_token"]) {
  //     const user = {
  //       access_token: params["access_token"],
  //       expires_in: params["expires_in"],
  //       state: params["state"],
  //       token_type: params["token_type"],
  //     };
  //     console.log(user);
  //   }
  // }, [user]);

  return (
    <div>
      {user == undefined ? (
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>
                <Link onClick={(e) => handleClick(e)} href="#">
                  Login with Google
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Welcome {user.name}</h1>
        </div>
      )}
      {children}
    </div>
  );
};

export default Login;
