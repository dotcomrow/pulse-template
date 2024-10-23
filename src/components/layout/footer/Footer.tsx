import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button, ButtonGroup } from "@nextui-org/button";

export default function Footer() {

    const linksContent = <>
        <ul className="flex-wrap items-center mt-0 text-sm font-medium text-gray-500 dark:text-gray-400 flex">
            <li>
                <Link href="#" className="hover:underline me-4 md:me-6">About</Link>
            </li>
            <li>
                <Link href="#" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
            </li>
            <li>
                <Link href="#" className="hover:underline me-4 md:me-6">Licensing</Link>
            </li>
            <li>
                <Link href="#" className="hover:underline">Contact</Link>
            </li>
        </ul>
    </>


    return (
        <footer className="flex fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow items-center justify-between dark:bg-gray-800 dark:border-gray-600">
            <span className="flex text-sm text-gray-500 sm:text-center dark:text-gray-400">&copy; {new Date().getFullYear()}{" "} Suncoast Systems.</span>
            <div className="md:flex hidden">
                {linksContent}
            </div>
            <div className="md:hidden flex">
                <Popover placement="top-end">
                    <PopoverTrigger>
                        <Button variant="flat" size="sm">
                            Links
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        {linksContent}
                    </PopoverContent>
                </Popover>
            </div>
        </footer>
    );
}
