import ActivityTable from "@component/map/components/ActivityTable";

export default function Settings({
    initialPosition,
    token
}: {
    initialPosition: { coords: { latitude: number, longitude: number } },
    token: string
}) {
    return (
        <div>
            <ActivityTable 
                initialPosition={initialPosition}
                token={token}
            />
        </div>
    );
}