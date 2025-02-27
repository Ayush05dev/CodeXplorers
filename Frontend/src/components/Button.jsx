export default function Button({ children, onClick, className = '' }) {
    return (
      <button
        onClick={onClick}
        className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors ${className}`}
      >
        {children}
      </button>
    );
  }