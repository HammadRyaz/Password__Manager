import React, { useState, useEffect } from "react";
import { Skeleton } from "antd";

function Heading() {
  // State to manage loading
  const [loading, setLoading] = useState(true);

  // Simulate data loading (e.g., fetching content)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2000ms (2 seconds)
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  return (
    <>
      <div className="flex flex-col text-center text-2xl py-2 ">
        {/* Heading Text with Skeleton Loader */}
        {loading ? (
          <Skeleton active paragraph={false} />
        ) : (
          <span className="text-green-500 hover:animate-pulse cursor-pointer text-4xl font-bold">
            {" "}
            &lt;<span className="dark:text-gray-900">Pass</span>
            <span>Mongo/&gt;</span>
          </span>
        )}
        {loading ? (
          <Skeleton active paragraph={false} />
        ) : (
          <div>MongoDB Password Manager</div>
        )}
      </div>

      <div className="flex justify-center items-center">
        {/* Social Media Icons with Skeleton Loader */}
        {loading ? (
          <>
            <Skeleton.Avatar active size={50} shape="circle" className="mr-2" />
            <Skeleton.Avatar active size={50} shape="circle" className="mr-2" />
            <Skeleton.Avatar active size={50} shape="circle" />
          </>
        ) : (
          <>
            <a
              href="https://www.behance.net/HammadRyaz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Password__Manager/assets/icons8-behance-50.png"
                alt="Behance"
                className="w-12 h-12 animate-pulse"
              />
            </a>
            <a
              href="https://github.com/HammadRyaz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Password__Manager/assets/icons8-github.gif"
                alt="GitHub"
                className="w-12 h-12"
              />
            </a>
            <a
              href="https://www.instagram.com/hammad__riaz0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Password__Manager/assets/icons8-instagram.gif"
                alt="Instagram"
                className="w-12 h-12"
              />
            </a>
          </>
        )}
      </div>
    </>
  );
}

export default Heading;
