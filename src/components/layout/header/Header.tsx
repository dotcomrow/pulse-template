
import ProfileAvatar from "@component/profile/ProfileAvatar";

export default function Header({ title, children }) {

    return (
        <header className="header h-10">
            {/* <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>{title}</h1>
                    </div>
                </div>
            </div> */}
            <div className="flex md:flex md:flex-grow flex-row justify-end px-5 py-5">
                <ProfileAvatar children={undefined}></ProfileAvatar>
            </div>
            {children}
        </header>
    );
};