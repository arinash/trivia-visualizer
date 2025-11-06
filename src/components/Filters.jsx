import { getUniqueCategories } from "../utils/dataUtils";

const Filters = ({ questions, selectedCategories, onCategoryChange }) => {
  const categories = getUniqueCategories(questions);

  const handleCategoryChange = (category) => {
    if (category === "all") {
      onCategoryChange(["all"]);
      return;
    }

    let newSelected = [...selectedCategories];
    if (selectedCategories.includes(category)) {
      newSelected = newSelected.filter(cat => cat !== category);
    } else {
      newSelected = newSelected.filter(cat => cat !== "all");
      newSelected.push(category);
    }

    if (newSelected.length === 0) {
      newSelected = ["all"];
    }

    onCategoryChange(newSelected);
  };

  return (
    <div className="card-base mb-8">
      <label className="block text-sm font-medium text-secondary-700 mb-2">
        Choose Categories:
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCategories.includes("all")
              ? "bg-primary-600 text-white"
              : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => {
          const count = questions.filter(q => q.category === category).length;
          return (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategories.includes(category)
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default Filters;