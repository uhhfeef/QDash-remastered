
export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="QDash Logo" className="h-8 w-8" />
          <h1 
            className="text-xl text-black font-black uppercase" 
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            QDASH
          </h1>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center">
          {/* Bug Icon */}
          <a
            href="https://forms.gle/pgjjeCz2y4meSxRU9"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Report a Bug"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 lucide lucide-bug"
            >
              <path d="m8 2 1.88 1.88" />
              <path d="M14.12 3.88 16 2" />
              <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
              <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
              <path d="M12 20v-9" />
              <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
              <path d="M6 13H2" />
              <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
              <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
              <path d="M22 13h-4" />
              <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
            </svg>
          </a>

          {/* User Profile */}
          <button
            id="logoutBtn"
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full"
            title="Logout"
          >
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs text-white"></span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
