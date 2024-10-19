"use client";

import Link from "next/link";
import { useAppSelector } from "@hook/redux";
import { selectUser } from "@lib/features/user/userSlice";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { ThemeSwitcher } from "@component/theme/ThemeSwitcher";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

const ProfileAvatar = ({ children }) => {

  const state: any = useAppSelector(selectUser);

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
    localStorage.setItem(STATE, now.getTime().toString());
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

  return (
    <div>
      {state.status != "complete" ? (
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
            </div>
          </div>
        </div>
      ) : (
        <div>
          {state.user == undefined ? (
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
              <Popover placement="left-start" showArrow={true}>
                <PopoverTrigger>
                  <Avatar src={state.user.picture} />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <p>Welcome {state.user.name}</p>
                    <ThemeSwitcher />
                    <p><Link href="#" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      localStorage.clear();
                      window.location.reload();
                    }}>Logout</Link></p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
