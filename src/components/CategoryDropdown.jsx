import { useState, useEffect, useRef } from "react";

function CategoryDropdown({
  selectedCategories,
  onSelectCategory,
  categories,
}) {
  const [isOpen, setIsOpen] = useState(false);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-gray-200 dark:bg-gray-700 px-3 py-1 mt-2 rounded-full w-fit flex items-center hover:bg-gray-300 dark:hover:bg-gray-800"
        onClick={toggleDropdown}
      >
        <span className="material-symbols-outlined">add</span>
      </button>
      {isOpen && (
        <div className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 flex flex-wrap w-96 p-3 space-y-2 space-x-2 mt-2">
          {availableCategories.map((category) => (
            <button
              key={category.id}
              className={`${category.bg_color} ${category.font_color} ${category.dark_bg_color} ${category.dark_font_color} px-3 py-1 rounded-full sm:text-sm text-xs w-fit flex items-center space-x-1 dark:hover:opacity-80 hover:opacity-80`}
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
