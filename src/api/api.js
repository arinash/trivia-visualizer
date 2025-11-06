import axios from "axios";

const BASE_URL = "https://opentdb.com/api.php";
const CATEGORY_URL = "https://opentdb.com/api_category.php";
const TOKEN_URL = "https://opentdb.com/api_token.php?command=request";

// Get or create session token
const getSessionToken = async () => {
    const token = localStorage.getItem('trivia_token');
    if (token) {
        return token;
    }
    try {
        const response = await axios.get(TOKEN_URL);
        if (response.data.response_code === 0) {
            localStorage.setItem('trivia_token', response.data.token);
            return response.data.token;
        }
    } catch (error) {
        console.warn("Failed to get session token:", error);
    }
    return null;
};

// Delay helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry helper function with token reset
const retryOperation = async (operation, retries = 3, delayMs = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await operation();
            // Check for token-related errors
            if (result.data?.response_code === 3 || result.data?.response_code === 4) {
                localStorage.removeItem('trivia_token');
                throw new Error('Token expired or invalid');
            }
            return result;
        } catch (error) {
            if (error.response?.status === 429 || error.message === 'Token expired or invalid') {
                if (i === retries - 1) throw error;
                // Longer delay for rate limits
                await delay(delayMs * Math.pow(2, i));
                if (error.message === 'Token expired or invalid') {
                    // Clear token and let next attempt get a new one
                    localStorage.removeItem('trivia_token');
                }
                continue;
            }
            throw error;
        }
    }
};

// Fetch all categories
export const fetchCategories = async () => {
    try {
        const response = await retryOperation(() => axios.get(CATEGORY_URL));
        return response.data.trivia_categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Fetch questions for a specific category
export const fetchQuestionsByCategory = async (categoryId, amount = 10) => {
    try {
        const token = await getSessionToken();
        const response = await retryOperation(() => 
            axios.get(BASE_URL, {
                params: {
                    amount,
                    category: categoryId,
                    type: "multiple",
                    token,
                },
            })
        );

        if (response.data.response_code === 0) {
            return response.data.results;
        } else if (response.data.response_code === 1) {
            console.warn("No questions were found for category ${categoryId}.");
            return [];
        } else {
            throw new Error("No questions found for the category ${categoryId}.");
        }

        return response.data.results;
    } catch (error) {
        console.error("Error fetching questions for category ${categoryId}:", error);
        return [];
    }
};