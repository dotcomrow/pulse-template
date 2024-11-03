import ActivityTable from "@component/map/components/ActivityTable";
import { cookies, headers } from "next/headers";

export default async function Settings() {

    const headersList = await headers();
    const cookieStore = await cookies();
    return (
        <div>
            <div>
                
            </div>
            <ActivityTable 
                  token={cookieStore.get('token')?.value || ''}
            />
        </div>
    );
}