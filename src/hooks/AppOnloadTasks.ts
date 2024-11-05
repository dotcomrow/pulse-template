import LocationOnLoad from "@hook/initTasks/LocationOnLoad";

export default function AppOnloadTasks({ headersList, store }: { headersList: any, store: any }) {

    const onLoadTasks = [
        {
            name: "LocationOnLoad",
            task: LocationOnLoad
        }
    ]

    const executeOnloadTasks = () => {
        onLoadTasks.forEach(task => {
            task.task({ headersList, store });
        });
    };

    return {
        executeOnloadTasks
    }
}