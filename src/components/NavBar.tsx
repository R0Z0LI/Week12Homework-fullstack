import Link from "next/link";

function Navbar() {
  return (
    <ul className="flex justify-start py-4 px-6 m-6 rounded-lg bg-blue-600">
      <li className="p-2 ml-8 rounded-lg bg-blue-300 hover:bg-blue-200">
        <Link href="/users">
          <p className="">Users</p>
        </Link>
      </li>
      <li className="p-2 ml-8 rounded-lg bg-blue-300 hover:bg-blue-200">
        <Link href="/tasks">
          <p className="">Projects</p>
        </Link>
      </li>
      <li className="p-2 ml-8 rounded-lg bg-blue-300 hover:bg-blue-200">
        <Link href="/projects">
          <p className="">Tasks</p>
        </Link>
      </li>
      <li className="p-2 ml-8 rounded-lg bg-blue-300 hover:bg-blue-200">
        <Link href="/">
          <p className="">Log out</p>
        </Link>
      </li>
    </ul>
  );
}

export default Navbar;
