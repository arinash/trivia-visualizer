// Decode HTML entities
const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

// Get unique categories from questions
export const getUniqueCategories = (questions) => {
    const categories = [...new Set(questions.map(q => decodeHtml(q.category)))];
    return categories.sort();
}

// Get category distribution for visualization
export const categoryDistribution = (questions) => {
    const categoryCount = questions.reduce((acc, question) => {
        const decodedCategory = decodeHtml(question.category);
        acc[decodedCategory] = (acc[decodedCategory] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(categoryCount).map(([categoryName, count]) => ({
        name: categoryName,
        count: count
    }));
};

// Get difficulty distribution for visualization
export const difficultyDistribution = (questions) => {
    const difficultyCount = questions.reduce((acc, question) => {
        acc[question.difficulty] = (acc[question.difficulty] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(difficultyCount).map(([difficulty, count]) => ({
        name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        count: count
    }));
};

// Get statistics
export const statistics = (questions) => {
    const categories = getUniqueCategories(questions);
    const difficulties = difficultyDistribution(questions);

    return {
        totalQuestions: questions.length,
        totalCategories: categories.length,
        easyCount: difficulties.find(item => item.name === "Easy")?.count || 0,
        mediumCount: difficulties.find(item => item.name === "Medium")?.count || 0,
        hardCount: difficulties.find(item => item.name === "Hard")?.count || 0,
    };
};


// Helper function for charts coloring
export const getColor = (index) => {
  const baseColors = ["#012a4a", "#014f86", "#2a6f97", "#013a63", "#01497c", "#2c7da0", "#468faf", "#61a5c2", "#89c2d9", "#a9d6e5"];
  if (index < baseColors.length) {
    return baseColors[index];
  } else {
    const newColor = (index - baseColors.length + 1) * 10;
    return `hsl(200, 60%, ${newColor}%)`;
  }
}