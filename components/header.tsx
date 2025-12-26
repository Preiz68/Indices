import Link from "next/link";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import Image from "next/image";
import { searchStocks } from "@/lib/actions/massive.actions";

const Header = async ({
  user,
}: {
  user: { id: string; name: string; email: string };
}) => {
  const initialStocks = await searchStocks();
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/assets/icons/logo.svg"
            alt="Indices Logo"
            width={140}
            height={32}
            priority
            className="w-auto h-8 cursor-pointer"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
