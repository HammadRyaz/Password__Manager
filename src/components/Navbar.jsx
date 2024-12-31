import React, { useState, useEffect } from "react";
import { Tooltip, Skeleton } from "antd";

function Navbar() {
  // State to simulate loading
  const [loading, setLoading] = useState(true);

  // Simulate data loading (e.g., fetching profile data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2000ms (2 seconds)
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer if the component unmounts
  }, []);

  return (
    <div>
      {/* Navigation bar */}
      <nav className="bg-white border-gray-200 dark:bg-gray-900 font-bold">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-center sm:justify-between mx-auto p-4 sm:space-x-0 space-x-5">
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Logo */}
            <div className="text-4xl text-white">
              <span className="text-green-300">&lt;</span>
              <font>Pass</font>
              <span className="text-green-300">Mongo/&gt;</span>
            </div>
          </a>

          {/* Profile Section with Skeleton Loader */}
          <Tooltip placement="bottom" title="Go To Github" color="purple">
            <div className="pt-3 md:pt-0 items-center md:order-1 space-x-3 md:space-x-0 rtl:space-x-reverse">
              {/* Conditionally display Skeleton or Content */}
              {loading ? (
                // Display Skeleton Avatar with 50px size when loading
                <Skeleton.Avatar
                  active
                  size={50}
                  shape="circle"
                  className="mr-2"
                />
              ) : (
                // Display actual profile info after loading
                <a
                  href="https://github.com/hammadryaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1"
                >
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white hover:border-green-300"
                    src="/Password__Manager/assets/profile.jpg"
                    alt="user photo"
                  />
                  <span className="text-white hover:text-green-300">
                    @HammadRyaz
                  </span>
                </a>
              )}
            </div>
          </Tooltip>
        </div>
      </nav>
      {/**-------------- */}
    </div>
  );
}

export default Navbar;
