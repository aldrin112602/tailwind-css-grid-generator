import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [currentYr, setCurrentYr] = useState(2025);
  useEffect(() => {
    const date = new Date();
    const yr = date.getFullYear();
    setCurrentYr(yr);
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-6 px-4 text-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Name */}
        <p className="text-sm md:text-base">
          © {currentYr} Aldrin Caballero. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="https://github.com/aldrin112602"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/aldrin02"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="mailto:caballeroaldrin02@gmail.com.com"
            className="hover:text-gray-400 transition"
          >
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
