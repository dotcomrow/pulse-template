
export default function Footer() {
    return (
        <footer className="h-10 justify-center">
            <div className="flex w-full px-2 py-2">
                &copy; {new Date().getFullYear()}{" "} Suncoast Systems
            </div>
        </footer>
    );
}
