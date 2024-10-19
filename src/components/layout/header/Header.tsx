
import ProfileAvatar from "@component/profile/ProfileAvatar";

export default function Header({ title, children }) {

    return (
        <header className="header h-10">
            <div className="w-full flex md:flex md:flex-grow flex-row columns-2">
                <div className="flex justify-start px-5 py-5 w-1/2">
                    <h1 className="text-2xl font-bold">{title}</h1>
                </div>
                <div className="flex justify-end px-5 py-5 w-1/2">
                    <ProfileAvatar children={undefined}></ProfileAvatar>
                </div>
            </div>
            {children}
        </header>
    );
};