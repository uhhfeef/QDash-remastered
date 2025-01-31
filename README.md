# QDash

QDash is a modern, interactive dashboard application that allows users to create, manage, and analyze data through an intuitive chat interface. Built with Remix and TypeScript, it combines the power of natural language processing with data visualization to make data analysis more accessible and efficient.

## 🌟 Features

- **Chat-Based Interface**: Interact with your data using natural language queries
- **Dynamic Dashboards**: Create and manage multiple dashboards for different data analysis needs
- **Real-Time Data Processing**: Powered by DuckDB for fast and efficient data operations
- **Modern UI**: Built with Tailwind CSS and modern React components
- **Type-Safe**: Written in TypeScript for better development experience and code reliability

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20.0.0
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/uhhfeef/QDash-remastered.git
cd qdash-remastered
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🛠️ Tech Stack

- **Framework**: [Remix](https://remix.run/)
- **Language**: TypeScript
- **Database**: DuckDB
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design system
- **Development Tools**:
  - ESLint for code linting
  - Prettier for code formatting
  - Vite for fast development experience

## 📁 Project Structure

```
qdash-remastered/
├── app/
│   ├── components/     # Reusable UI components
│   ├── routes/         # Application routes
│   ├── services/       # Business logic and services
│   ├── utils/          # Utility functions
│   └── root.tsx        # Root component
├── public/            # Static assets
└── prisma/           # Database schema and migrations
```

## 🔧 Configuration

The application can be configured through environment variables. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-database-url"
# Add other environment variables as needed
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Built with [Remix](https://remix.run/)
- UI components inspired by modern design systems
- Special thanks to all contributors
