//Footer.jsx
import React from "react";
import fleurDeLis from "../public/fleur-de-lis.svg";

const Footer = () => {
  return (
    <footer className="sm:text-sm text-xs text-gray-700 dark:text-gray-200 py-2  bg-white dark:bg-gray-900 shadow-sm dark:shadow-black">
      <div className="max-w-7xl mx-auto sm:px-4 px-4 flex flex-col sm:flex-row justify-between ">
        <div className="flex sm:space-x-5  justify-between items-center">
          <a
            href="https://malopolanie.zhr.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="order-2 sm:order-1"
          >
            <img src={fleurDeLis} alt="Fleur-de-lis" className="sm:w-16 sm:h-16 w-12 h-12 " />
          </a>
          <div className="flex flex-col  order-1 sm:order-2">
            <div className="flex items-center space-x-2 mb-1">
              <span className="material-symbols-outlined !text-xl">help</span>
              <p className=" font-semibold">Pomoc:</p>
            </div>

            <p>
              Mail do kapituły:{" "}
              <a href="mailto:kapitulaho.hkk@gmail.com" className=" underline">
                kapitulaho.hkk@gmail.com
              </a>
            </p>
            <a
              href="https://drive.google.com/file/d/1FDp85Au36SpG0OXxA5wEZnFTalU7Cr3A/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className=" underline"
            >
              Instrukcja PDF
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:mt-0 mt-4 sm:items-start">
          <div className="flex items-center space-x-2 mb-1">
            <span className="material-symbols-outlined !text-xl">Group</span>
            <p className=" font-semibold">Autorzy:</p>
          </div>
          <p>
            pwd. Jakub Prażuch HR -{" "}
            <a
              href="mailto:jakub.prazuch@malopolska.zhr.pl"
              className=" underline"
            >
              jakub.prazuch@malopolska.zhr.pl
            </a>
          </p>
          <p>
            pwd. Jakub Pomorski HR -{" "}
            <a
              href="mailto:jakub.pomorski@malopolska.zhr.pl"
              className=" underline"
            >
              jakub.pomorski@malopolska.zhr.pl
            </a>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
