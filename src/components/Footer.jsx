/**
 * Footer component  displaying data source and technical details
 */
const Footer = () => {
  return (
    <footer className="mt-5 py-8 text-center border-t border-secondary-200 text-secondary-500">
        <p className="text-body">
            Data sourced from <a 
              href="https://opentdb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-primary-700 transition-colors"
            >
                Open Trivia Database
            </a>.
        </p>
        <p className="mt-2 text-sm text-secondary-400">
            Built with React and Tailwind CSS.
        </p>
    </footer>
  )
}

export default Footer;