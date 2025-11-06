const Card = ({ title, value }) => {
  return (
    <div className="card-base flex fitems-center gap-4 border border-primary-600 transition-transform hover:scale-105 hover:shadow-custom">
      <div className="flex-1">
        <p className="text-xs uppercase font-medium tracking-wide text-secondary-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-secondary-800">{value}</p>
    </div>
    </div>
  )
}

export default Card;