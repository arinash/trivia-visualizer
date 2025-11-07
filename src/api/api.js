import axios from "axios";

const BASE_URL = "https://opentdb.com/api.php";
const CATEGORY_URL = "https://opentdb.com/api_category.php";
const TOKEN_URL = "https://opentdb.com/api_token.php?command=request";

/**
 * Obtain or reuse an OpenTDB session token.
 * The token is cached in localStorage to persist across reloads.
 * 
 * @returns the token string or null if one couldn't be obtained
 */
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

// Simple delay helper used by retry logic
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper funciton to retry an async operation with exponential
 * backoff. It also handles token-related response codes from the API and
 * clears the cached token so subsequent attempts fetch a fresh one.
 *
 * @param {Function} operation - function that returns an axios promise
 * @param {number} retries - number of retry attempts
 * @param {number} delayMs - base delay (ms) used for exponential backoff
 */
const retryOperation = async (operation, retries = 3, delayMs = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await operation();
            // Clear the token if the API indicates the token is invalid/expired
            if (result.data?.response_code === 3 || result.data?.response_code === 4) {
                localStorage.removeItem('trivia_token');
                throw new Error('Token expired or invalid');
            }
            return result;
        } catch (error) {
            // Retry with backoff if rate-limited or token issues
            if (error.response?.status === 429 || error.message === 'Token expired or invalid') {
                if (i === retries - 1) throw error;
                await delay(delayMs * Math.pow(2, i));
                if (error.message === 'Token expired or invalid') {
                    localStorage.removeItem('trivia_token');
                }
                continue;
            }

            throw error;
        }
    }
};

/**
 * Fetch the list of categories
 * Uses the retry helper to handle network errors and rate limits.
 */
export const fetchCategories = async () => {
    try {
        const response = await retryOperation(() => axios.get(CATEGORY_URL));
        return response.data.trivia_categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

/**
 * Fetch a number of questions. Uses a session token when available to reduce
 * duplicate questions and help avoid sending too many requests.
 *
 * @param {number} categoryId - category id or null to fetch across all categories
 * @param {number} amount - number of questions to fetch
 * 
 * @returns {Array} array of question objects (or an empty array on failure)
 */
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
            console.warn(`No questions were found for category ${categoryId}.`);
            return [];
        } else {
            throw new Error(`No questions found for the category ${categoryId}.`);
        }
    } catch (error) {
        console.error(`Error fetching questions for category ${categoryId}:`, error);
        return [];
    }
};