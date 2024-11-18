export interface Celebrity {
    id: number;
    name: string;
    date_of_birth: string;
    zodiac_sign: string;
    gender: string;
    nationality: string;
    profession: string;
    biography: string;
    image_url: string;
    social_links: string; // JSON string
    famous_works: string; // JSON string
    popularity_score: number;
    created_at: string;
}

export const sampleCelebrities: Celebrity[] = [
    {
        id: 1,
        name: "Leonardo DiCaprio",
        date_of_birth: "1974-11-11",
        zodiac_sign: "Scorpio",
        gender: "Male",
        nationality: "American",
        profession: "Actor",
        biography: "Award-winning actor known for his intense method acting and environmental activism.",
        // Lorem ipsum image
        image_url: "https://loremflickr.com/640/480/abstract",
        social_links: JSON.stringify({
            instagram: "@leonardodicaprio",
            twitter: "@LeoDiCaprio"
        }),
        famous_works: JSON.stringify([
            "Titanic",
            "Inception",
            "The Revenant",
        ]),
        popularity_score: 9.8,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        name: "Beyoncé",
        date_of_birth: "1981-09-04",
        zodiac_sign: "Virgo",
        gender: "Female",
        nationality: "American",
        profession: "Singer",
        biography: "Multi-award winning singer, songwriter, and actress. Former member of Destiny's Child.",
        image_url: "https://loremflickr.com/640/480/abstract",
        social_links: JSON.stringify({
            instagram: "@beyonce",
            twitter: "@Beyonce"
        }),
        famous_works: JSON.stringify([
            "Lemonade",
            "Renaissance",
            "Black Is King"
        ]),
        popularity_score: 9.9,
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        name: "Tom Holland",
        date_of_birth: "1996-06-01",
        zodiac_sign: "Gemini",
        gender: "Male",
        nationality: "British",
        profession: "Actor",
        biography: "Known for playing Spider-Man in the Marvel Cinematic Universe.",
        image_url: "https://loremflickr.com/640/480/abstract",
        social_links: JSON.stringify({
            instagram: "@tomholland2013",
            twitter: "@TomHolland1996"
        }),
        famous_works: JSON.stringify([
            "Spider-Man: No Way Home",
            "Cherry",
            "The Devil All the Time"
        ]),
        popularity_score: 9.5,
        created_at: new Date().toISOString()
    }
];
