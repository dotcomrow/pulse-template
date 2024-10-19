import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer bg-black h-10">
            <div className="flex pt-2 ps-2 pb-3 pe-2 text-center">
                <div className="d-inline inverse-container">
                    <Link href="/" className="text-decoration-none text-white">
                        Home
                    </Link>
                </div>
                <span className="d-none d-md-inline ms-3 text-white footer-text">
                    |
                </span>
                <span className="ms-3 text-white footer-text fw-normal">
                    &copy; {new Date().getFullYear()}{" "} Suncoast Systems
                </span>
            </div>
        </footer>
    );
}
