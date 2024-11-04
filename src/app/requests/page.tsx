import ActivityTable from "@component/map/components/ActivityTable";
import { cookies } from "next/headers";

export default async function Settings() {

    const cookieStore = await cookies();
    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold pb-3 pt-2 px-3">Nearby Requests</h2>
            </div>
            <ActivityTable />
        </div>
    );
}