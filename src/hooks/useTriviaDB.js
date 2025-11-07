import { useState, useEffect } from "react";
import { fetchCategories, fetchQuestionsByCategory } from "../api/api";

/**
 * Custom React hook to fetch trivia categories and questions from the
 * Open Trivia DB and provide filter state.
 *
 * @returns {Object}:
 * - categories: array of category objects
 * - questions: array of fetched question objects
 * - filteredQuestions: questions filtered by selectedCategories
 * - loading: request status
 * - error: request status
 * - selectedCategories: array state for multi-select
 * - setSelectedCategories: function to set array state for multi-select
 *
 * Notes: By default this hook fetches 50 questions and all categories on mount.
 */

const useTriviaDB = () => {
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(["all"]);
    const [filteredQuestions, setFilteredQuestions] =

    // Fetch categories and initial questions on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch catgories
                const data = await fetchCategories();
                setCategories(data);

                //Fetch questions from fetched categories
                const questionsData = await fetchQuestionsByCategory(null, 50);
                setQuestions(questionsData);
                setFilteredQuestions(questionsData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter questions when selectedCategories or questions change
    // Show all questions when "all" is selected
    useEffect(() => {
        if (selectedCategories.includes("all")) {
            setFilteredQuestions(questions);
        } else {
            const filtered = questions.filter(q => selectedCategories.includes(q.category));
            setFilteredQuestions(filtered);
        }
    }, [selectedCategories, questions]);

    // Helper function to reset filter
    const resetFilter = () => {
        setSelectedCategories(["all"]);
    };

    return {
        categories,
        questions,
        filteredQuestions,
        loading,
        error,
        selectedCategories,
        setSelectedCategories,
    };
}

export default useTriviaDB;