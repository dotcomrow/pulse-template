import ProfileAvatar from "@component/profile/ProfileAvatar";
import { headers } from 'next/headers'
import { getRequestContext } from "@cloudflare/next-on-pages";
import { default as LogUtility } from "@utils/LoggingUtility";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { ThemeSwitcher } from "@component/theme/ThemeSwitcher";

export const runtime = 'edge';

export default async function Home() {

  await LogUtility.logEntry(await LogUtility.buildLogContext(), [
    {
      severity: "INFO",
      jsonPayload: {
        message: "App Request",
        context: getRequestContext(),
        headers: headers(),
      },
    }
  ]);


  return (
    <>
      <div>
        <ProfileAvatar children={undefined}></ProfileAvatar>
      </div>
      <div className="flex gap-3 items-center">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        {/* <Avatar name="Junior" />
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
          <Avatar name="Jane" />
          <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
          <Avatar name="Joe" /> */}
        <ThemeSwitcher />
      </div>
      <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
        <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0" src="/img/erin-lindford.jpg" alt="Woman's Face" />
        <div className="text-center space-y-2 sm:text-left">
          <div className="space-y-0.5">
            <p className="text-lg text-black font-semibold">
              Erin Lindford
            </p>
            <p className="text-gray-500 font-medium">
              Product Engineer
            </p>
          </div>
          <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Message</button>
        </div>
      </div>
    </>
  );
}
