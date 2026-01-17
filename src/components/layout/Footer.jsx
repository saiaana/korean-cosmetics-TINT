import Logo from "../ui/Logo";

function Footer() {
  return (
    <footer className="mb-5 mt-10 hidden w-full flex-row justify-between px-5 md:visible md:flex">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <Logo color="black" />
        </div>
        <p className="text-xs text-gray-700">© 2026 All rights reserved.</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className={`text-xs uppercase text-black`}>
          Korean cosmetics for you
        </p>
      </div>
    </footer>
  );
}

export default Footer;
