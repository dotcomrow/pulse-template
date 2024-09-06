import Refresh from "@component/login/Refresh";
export const runtime = 'edge';

export default async function authCallback() {

    return (
        <div>
            <Refresh />
        </div>
    );

}