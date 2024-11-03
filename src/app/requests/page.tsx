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
                initialPosition={{
                    coords: {
                      latitude: parseFloat(headersList.get('x-vercel-ip-latitude') ?? '0'),
                      longitude: parseFloat(headersList.get('x-vercel-ip-longitude') ?? '0'),
                    }
                  }}
                  token={cookieStore.get('token')?.value || ''}
            />
        </div>
    );
}