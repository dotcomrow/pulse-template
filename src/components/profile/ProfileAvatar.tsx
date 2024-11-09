"use client";

import { useAppSelector } from "@hook/redux";
import { selectUser } from "@lib/features/user/userSlice";
import { useCookies } from 'react-cookie';
import { CookieSetOptions } from "universal-cookie";
import SessionTimeout from "@component/modals/timeout/SessionTimeout";
import { Button, ButtonGroup } from "@nextui-org/button";
import { User } from "@nextui-org/user";
import { Skeleton } from "@nextui-org/skeleton";
import React, { ReactElement, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/dropdown";
import Link from "next/link";
import { default as Constants } from "@utils/constants";

const ProfileAvatar = () => {

  const state: any = useAppSelector(selectUser);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "expires"]);
  const [profileAvatar, setProfileAvatar] = React.useState<ReactElement | null>(null);
  const [selectedKey, setSelectedKey] = React.useState<string>("");
  const STATE = "state";
  let googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  let googleClientId =
    "488218567442-uj3hsd9g13so40fgc89srllfeoiuqeer.apps.googleusercontent.com";


  const handleClick = (e: any) => {
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
    var params: { [key: string]: string | null } = {
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
      input.setAttribute("value", params[p] || "");
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    if (state.user == undefined && state.status == "complete") {
      setProfileAvatar(<div className="w-full flex justify-end">
        <Button size="md" onClick={(e) => handleClick(e)}>Login</Button>
      </div>);
    } else if (state.status == "complete") {
      setProfileAvatar(
        <>
          <Dropdown
            placement="bottom-end"
            backdrop="blur"
            onFocus={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!Constants.profileNavLinks.find((item) => item.link === window.location.pathname)) {
                setSelectedKey("");
              }
            }}>
            <DropdownTrigger>
              <User
                name={state.user.name}
                description={state.user.email}
                className="cursor-pointer"
                classNames={{
                  wrapper: "max-lg:hidden"
                }}
                avatarProps={{
                  src: state.user.picture
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2 max-lg:hidden" isReadOnly textValue="Sign in details">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{state.user.email}</p>
              </DropdownItem>
              <DropdownSection className="max-lg:hidden">
                {
                  Constants.profileNavLinks.map((item, index) => {
                    return (
                      <DropdownItem key={item.link} textValue={item.title}>
                        <Link href={item.link}
                          onClick={(e) => { setSelectedKey(item.link) }}
                          className={selectedKey === item.link ? "text-primary" : "text"}
                        >
                          {item.title}
                        </Link>
                      </DropdownItem>
                    );
                  })
                }
              </DropdownSection>
              <DropdownItem textValue="Logout" key="logout" color="danger" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                var options = {
                  path: "/",
                  expires: new Date(Date.now()),
                  secure: (window.location.protocol === "https:"),
                  // httpOnly: true,
                  sameSite: "lax"
                } as CookieSetOptions;
                if (!window.location.hostname.includes("localhost")) {
                  options.domain = window.location.hostname;
                  // options.httpOnly = true;
                  options.sameSite = "lax";
                }
                removeCookie("token", options);
                removeCookie("expires", options);
                localStorage.clear();
                if (Constants.navLinks.find((item) => item.link === window.location.pathname)) {
                  window.location.reload();
                } else {
                  window.location.href = "/";
                }
              }}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <SessionTimeout />
        </>
      );
    } else {
      setProfileAvatar(
        <div className="lg:w-2/5 flex justify-end">
          <div>
            <Skeleton className="flex rounded-full w-10 h-10" />
          </div>
          <div className="w-full flex flex-col gap-2 max-sm:hidden">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      );
    }
  }, [state, selectedKey]);

  useEffect(() => {
    if (Constants.profileNavLinks.find((item) => item.link === window.location.pathname)) {
      setSelectedKey(window.location.pathname);
    }
  }, []);

  return (
    <>
      {profileAvatar}
    </>
  );
};

export default ProfileAvatar;
