import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-4 text-center">
      <h1 className="text-8xl font-bold text-[#3b82f6]">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-white">Page Not Found</h2>
      <p className="mt-3 max-w-md text-[#a1a1aa]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#3b82f6] px-6 py-3 text-white hover:bg-[#2563eb]"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;