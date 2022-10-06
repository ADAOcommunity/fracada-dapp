import Link from "next/link";

const Landing = () => {
  return <>
    <h1 className="mb-8 text-4xl font-bold leading-none tracking-tighter text-neutral-600 md:text-7xl lg:text-5xl">The simplest way to fractionalize NFTs</h1>
    <p className="mb-8 text-base leading-relaxed text-left text-gray-500">Using power of open-source, funded by Catalyst.</p>
    <div className="mt-0 lg:mt-6 max-w-7xl sm:flex">
      <div className="mt-3 rounded-lg sm:mt-0">
        <Link href={'/fractionalize'}>
          <button className="items-center block px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Fractionalize</button>
        </Link>
      </div>
      <div className="mt-3 rounded-lg sm:mt-0 sm:ml-3">
        <Link href={'/unlock'}>
          <button className="items-center block px-10 py-3.5 text-base font-medium text-center bg-white text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Unlock</button>
        </Link>
      </div>
    </div>
  </>;
};

export default Landing