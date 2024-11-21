# Celebrity Zodiac Web Application

A modern web application that showcases and organizes celebrities by their zodiac signs. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Browse celebrities by zodiac signs
- View featured celebrities
- Search celebrities by name or profession
- Responsive design with modern UI
- Efficient data handling with JSON files
- Type-safe data handling

## Tech Stack

- **Frontend:**
  - Next.js 15 (with React 19 RC)
  - TypeScript
  - Tailwind CSS
  - Next.js Image Component

- **Backend:**
  - Next.js API Routes
  - Node.js
  - JSON Data Storage

- **Data Processing:**
  - Node.js Scripts
  - TypeScript
  - Custom API (for data enrichment)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/celebshome.git
cd celebshome
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file and set your configuration:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Data Processing Scripts

### 1. Fetch Initial Celebrity Data
```bash
npm run fetch:celebrities
# or
yarn fetch:celebrities
```

### 2. Enrich Celebrity Data
```bash
npm run fetch:enrich_celebrities
# or
yarn fetch:enrich_celebrities
```

The data processing scripts will:
1. Fetch a list of celebrities from various sources
2. Enrich the data with biographical information using OpenAI's API
3. Save the processed data to JSON files in the `data` directory

## Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

Build the application for production:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm start
# or
yarn start
```

## Data Structure

The application uses JSON files to store celebrity data with the following structure:

```typescript
interface ICelebrity {
  id: number;
  name: string;
  dateOfBirth: string;
  dateOfDeath?: string;
  zodiacSign: string;
  gender: string;
  nationality: string;
  profession: string;
  biography: string;
  imageUrl: string;
  popularityScore: number;
  additionalData?: {
    wikiUrl?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt?: string;
}
```

## Project Structure

```
celebshome/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── models/          # Data models
│   ├── services/        # Service layer
│   └── controllers/     # Controllers
├── scripts/            # Scripts for data processing
│   ├── fetch_celebrities.ts
│   ├── enrich_celebrity_data.ts
├── public/            # Static files
└── data/             # JSON data and database files
    └── celebrities.json
    └── enriched_celebrities.json
```

## Data Processing Flow

1. `fetch_celebrities.ts`: Fetches initial celebrity data from various sources
2. `enrich_celebrity_data.ts`: Adds additional information to the celebrity data
3. `db_init.ts`: Creates and populates the SQLite database
4. `db_update.ts`: Updates existing records with new data

## API Routes

- `GET /api/celebrities/featured` - Get featured celebrities
- `GET /api/celebrities/profile/:slug` - Get celebrity profile
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
