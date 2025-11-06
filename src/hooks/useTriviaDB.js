import { useState, useEffect } from "react";
import { fetchCategories, fetchQuestionsByCategory } from "../api/api";

const useTriviaDB = () => {
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(["all"]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);

    //Fetch categories on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchCategories();
                setCategories(data);

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

    //Filter questions based on selected categories
    useEffect(() => {
        if (selectedCategories.includes("all")) {
            setFilteredQuestions(questions);
        } else {
            const filtered = questions.filter(q => selectedCategories.includes(q.category));
            setFilteredQuestions(filtered);
        }
    }, [selectedCategories, questions]);

    //Reset filter
    const resetFilter = () => {
        setSelectedCategory("all");
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