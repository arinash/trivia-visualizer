import Header from './components/Header.jsx'
import useTriviaDB from './hooks/useTriviaDB.js'
import Category from './components/Category.jsx'
import Card from './components/Card.jsx'
import Filters from './components/Filters.jsx'
import Spinner from './components/Spinner.jsx'
import Footer from './components/Footer.jsx'
import Difficulty from './components/Difficulty.jsx'
import { statistics } from './utils/dataUtils.js'

/**
 * Main app component
 */
function App() {
  // Use custom hook for data fetching
  const {
    categories,
    questions,
    filteredQuestions,
    loading,
    error,
    selectedCategories,
    setSelectedCategories,
  } = useTriviaDB();

  // Calculate statistics from filtered data
  const stats = filteredQuestions.length > 0 ? statistics(questions) : null;

  return (
    <div className="app">
      <div className="container">
        <Header />
        {/* Render loading state */}
        {loading ? (
          <Spinner />
        // Render error state
        ) : error ? (
          <div className="text-error text-center mt-4">
            Error: {error.message}
          </div>
        ) : (
          <>
            <div className="card-grid">
              <Card title="Total Categories" value={stats?.totalCategories} />
              <Card title="Total Questions" value={stats?.totalQuestions} />
              <Card title="Easy Questions" value={stats?.easyCount} />
              <Card title="Hard Questions" value={stats?.hardCount} />
            </div>
            <Filters questions={questions} selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories}/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Category questions={filteredQuestions}/>
              <Difficulty questions={filteredQuestions}/>
            </div>
            
            <Footer />
          </>
        )}
      </div>
    </div>
  )
}

export default App
