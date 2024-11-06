import ActivityTable from "@component/map/components/ActivityTable";

export default async function Settings() {

    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold pb-3 pt-2 px-3">Nearby Requests</h2>
            </div>
            <ActivityTable />
        </div>
    );
}