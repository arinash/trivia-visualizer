/**
 * Header component displaying title and brief description
 */
const Header = () => {
  return (
    <header className="w-full top-0 left-0 bg-white shadow-custom px-8 py-4 flex flex-col items-start">
      <h1 className="heading-lg text-primary-800 mb-2">Trivia Visualizer</h1>
      <p className="text-body">
        Explore trivia questions across various categories.
      </p>
    </header>
  )
}

export default Header;