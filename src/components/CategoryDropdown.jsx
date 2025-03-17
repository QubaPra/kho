import { useState, useEffect, useRef } from "react";

function CategoryDropdown({
  selectedCategories,
  onSelectCategory,
  categories,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (category) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  const availableCategories = categories.filter(
    (category) => !selectedCategories.includes(category.id)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const checkDropdownPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = rect.height;

        if (rect.bottom > viewportHeight && rect.top - dropdownHeight > 0) {
          setDropUp(true);
        } else if (rect.bottom > viewportHeight / 1.8) {
          setDropUp(true);
        } else {
          setDropUp(false);
        }
      }
    };

    if (isOpen) {
      checkDropdownPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", checkDropdownPosition);
    window.addEventListener("resize", checkDropdownPosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", checkDropdownPosition);
      window.removeEventListener("resize", checkDropdownPosition);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-gray-200 dark:bg-gray-600 px-3 py-1  my-1 rounded-full w-fit flex items-center hover:bg-gray-300 dark:hover:bg-gray-700"
        onClick={toggleDropdown}
      >
        <span className="material-symbols-outlined">add</span>
        {availableCategories.length > 11 && (
          <span className="ml-1 sm:text-sm text-xs">Dodaj kategorię</span>
        )}
      </button>
      {isOpen && (
        <div
          className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(0,0,0,0.7)] z-10 flex flex-wrap sm:w-96 w-72 p-3 sm:space-x-2 space-x-1 ${
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {availableCategories.map((category) => (
            <button
              key={category.id}
              className={`${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} px-3 py-1 rounded-full sm:text-sm sm:my-1 my-0.5 text-xs w-fit flex items-center space-x-1 dark:hover:opacity-80 hover:opacity-80`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className="material-symbols-outlined">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
