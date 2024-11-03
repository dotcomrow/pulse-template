import ActivityTable from "@component/map/components/ActivityTable";
import { cookies } from "next/headers";

export default async function Settings() {

    const cookieStore = await cookies();
    return (
        <div>
            <div>
                
            </div>
            <ActivityTable />
        </div>
    );
}