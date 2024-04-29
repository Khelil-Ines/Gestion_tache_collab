import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // useEffect(() => {
  //   const clickHandler = ({ target }: MouseEvent) => {
  //     if (!dropdown.current) return;
  //     if (
  //       !dropdownOpen ||
  //       dropdown.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     setDropdownOpen(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

if (session){
  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4 cursor-pointer"
      >
        {session?.user ? (
          <>
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black dark:text-white">
                {session.user.firstname || 'User'}
                {' '}
                {session.user.lastname || 'User'}
              </span>
              <span className="block text-xs">{session.user.email || 'No email'}</span>
            </span>
            <span className="h-12 w-12 rounded-full overflow-hidden">
              <Image
                width={48}
                height={48}
                src={session.user.image || "/images/user/unknown.png"}
                alt="User"
                className="rounded-full"
              />
            </span>
          </>
        ) : (
          <span className="text-sm font-medium">Sign In</span>
        )}
      </button>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          {session && (
            <>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  Account Settings
                </Link>
              </li>
            </>
          )}
          <li>
            {session ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/api/auth/signin"
                className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};
return <p>User is not logged in</p>;

}



export default DropdownUser;
