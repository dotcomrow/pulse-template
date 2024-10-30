import Refresh from "@component/profile/Refresh";
export const runtime = 'edge';

export default async function authCallback() {
    return (
        <Refresh />
    );
}