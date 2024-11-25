# CelebsHome - Celebrity Information Platform

A modern web application that showcases celebrities with dynamic image rendering and comprehensive information. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- Browse celebrities with dynamic image layouts
- View featured celebrities with optimized image loading
- Search celebrities by name or profession
- Responsive design with modern UI
- Type-safe data handling with TypeScript
- Efficient data storage with Supabase

## Tech Stack

- **Frontend:**
  - Next.js 15
  - TypeScript
  - Tailwind CSS
  - Next.js Image Component

- **Backend:**
  - Supabase (Database & Storage)
  - Next.js API Routes
  - TypeScript

- **Data Processing:**
  - Node.js Scripts
  - TypeScript
  - Supabase Client

## Project Structure
```
celebshome/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   └── (routes)/         # Page routes
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── FeaturedCelebrities.tsx
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   └── supabase.ts      # Supabase client
│   ├── models/              # Data models
│   ├── services/           # Service layer
│   ├── types/              # TypeScript types
│   └── controllers/        # Business logic
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
├── public/               # Static assets
└── scripts/             # Data processing scripts
```

## Data Structure

```typescript
interface ICelebrity {
  id: number;
  name: string;
  dateOfBirth: string;
  dateOfDeath?: string | null;
  zodiacSign: string;
  gender: string;
  nationality: string;
  profession: string;
  biography: string;
  imageUrl: string;
  popularityScore: number;
  additionalData?: Record<string, unknown> & {
    wikiUrl?: string;
  };
  createdAt: string;
  updatedAt?: string;
}
```

## API Routes

- `GET /api/celebrities/featured` - Get featured celebrities
  - Returns: Array of featured celebrities (default: 10 celebrities)
  - Response: 
    ```typescript
    {
      id: number;
      name: string;
      imageUrl: string;
      profession: string;
      biography: string;
      // ... other celebrity fields
    }[]
    ```

- `GET /api/celebrities/profile/[slug]` - Get celebrity by slug
  - Parameters: 
    - `slug`: URL-friendly version of celebrity name
  - Response: Detailed celebrity information
  - Status Codes:
    - 200: Success
    - 404: Celebrity not found
    - 500: Server error

- `GET /api/celebrities/search` - Search celebrities
  - Query Parameters: 
    - `query`: Search term for name, profession, or biography
  - Response: Array of matching celebrities
  - Status Codes:
    - 200: Success
    - 400: Missing query parameter
    - 500: Server error

- `GET /api/celebrities/zodiac/[sign]` - Get celebrities by zodiac sign
  - Parameters:
    - `sign`: One of the 12 zodiac signs (case-insensitive)
  - Valid Signs: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces
  - Response: Array of celebrities with the specified zodiac sign
  - Status Codes:
    - 200: Success
    - 400: Invalid zodiac sign
    - 500: Server error

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

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
Create a `.env.local` file in the root directory with the following variables:
```env
BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DB_PASS=your_supabase_db_password
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the database migration from `supabase/migrations/20240322000000_create_celebrities.sql`
   - The migration will:
     - Create the celebrities table with proper indexes
     - Set up text search capabilities
     - Configure automatic timestamp handling

## Data Migration

To migrate your celebrity data to Supabase:

1. Prepare your data:
   - Place your celebrity data in `src/data/enriched_celebrities.json`
   - Ensure the data follows the DatabaseRow interface structure

2. Build the migration scripts:
```bash
npm run build:scripts
```

3. Run the migration:
```bash
npm run migrate:supabase
```

The migration script will:
- Read the JSON data file
- Process celebrities in batches of 50
- Upload data to Supabase with proper error handling
- Log the migration progress

## Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run build:scripts` - Build TypeScript scripts
- `npm run migrate:supabase` - Run Supabase migration
- `npm run fetch:celebrities` - Fetch initial celebrity data
- `npm run fetch:enrich_celebrities` - Enrich celebrity data

## Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel --prod
```

Make sure to set up the following environment variables in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BASE_URL`

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
- Supabase for the cloud database and storage