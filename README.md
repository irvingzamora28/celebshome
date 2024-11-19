# Celebrity Zodiac Web Application

A modern web application that showcases and organizes celebrities by their zodiac signs. Built with Next.js 15, TypeScript, Tailwind CSS, and SQLite.

## Features

- Browse celebrities by zodiac signs
- View featured celebrities
- Search celebrities by name or profession
- Responsive design with modern UI
- Efficient database querying and caching
- Type-safe data handling

## Tech Stack

- **Frontend:**
  - Next.js 15 (with React 19 RC)
  - TypeScript
  - Tailwind CSS
  - Next.js Image Component

- **Backend:**
  - SQLite3
  - Node.js
  - Next.js API Routes

- **Data Processing:**
  - Deno Runtime
  - Deno SQLite
  - Deno Standard Modules

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SQLite3
- Deno (v1.37 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/celebshome.git
cd celebshome
```

2. Install dependencies:
```bash
npm install && deno install
# or
yarn install && deno install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file and set your configuration:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Data Processing and Database Setup

### 1. Fetch Initial Celebrity Data
```bash
deno run --allow-net --allow-write scripts/fetch_celebrities.ts
```

### 2. Enrich Celebrity Data
```bash
deno run --allow-net --allow-write --allow-read scripts/enrich_celebrity_data.ts
```

### 3. Initialize Database with Enriched Data
```bash
deno run --allow-read --allow-write --allow-net --unstable scripts/db_init.ts data/enriched_celebrities.json
```

### 4. Update Database with New Data
```bash
deno run --allow-read --allow-write scripts/db_update.ts data/enriched_celebrities.json
```

### Database Schema
```sql
CREATE TABLE celebrities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    zodiac_sign TEXT NOT NULL,
    profession TEXT NOT NULL,
    nationality TEXT NOT NULL,
    image_url TEXT NOT NULL,
    popularity_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Application

1. Start the development server:
```bash
deno task dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
celebshome/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── models/          # Data models
│   ├── services/        # Service layer
│   └── controllers/     # Controllers
├── scripts/            # Deno scripts for data processing
│   ├── fetch_celebrities.ts
│   ├── enrich_celebrity_data.ts
│   ├── db_init.ts
│   └── db_update.ts
├── public/            # Static files
└── data/             # JSON data and database files
    └── enriched_celebrities.json
```

## Data Processing Flow

1. `fetch_celebrities.ts`: Fetches initial celebrity data from various sources
2. `enrich_celebrity_data.ts`: Adds additional information to the celebrity data
3. `db_init.ts`: Creates and populates the SQLite database
4. `db_update.ts`: Updates existing records with new data

## API Routes

- `GET /api/celebrities/featured` - Get featured celebrities
- `GET /api/celebrities/zodiac/:sign` - Get celebrities by zodiac sign
- `GET /api/celebrities/search` - Search celebrities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- SQLite for the reliable database engine
- Deno team for the modern runtime
