export interface ICelebrity {
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
    additionalData?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface DatabaseRow {
    id: number;
    name: string;
    date_of_birth: string;
    date_of_death?: string | null;
    zodiac_sign: string;
    gender: string;
    nationality: string;
    profession: string;
    biography: string;
    image_url: string;
    popularity_score: number;
    additional_data?: string;
    created_at: string;
    updated_at: string;
}

export class Celebrity implements ICelebrity {
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
    additionalData?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;

    constructor(data: ICelebrity) {
        this.id = data.id;
        this.name = data.name;
        this.dateOfBirth = data.dateOfBirth;
        this.dateOfDeath = data.dateOfDeath;
        this.zodiacSign = data.zodiacSign;
        this.gender = data.gender;
        this.nationality = data.nationality;
        this.profession = data.profession;
        this.biography = data.biography;
        this.imageUrl = data.imageUrl;
        this.popularityScore = data.popularityScore;
        this.additionalData = data.additionalData;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static fromDatabaseRow(row: DatabaseRow): Celebrity {
        return new Celebrity({
            id: row.id,
            name: row.name,
            dateOfBirth: row.date_of_birth,
            dateOfDeath: row.date_of_death || null,
            zodiacSign: row.zodiac_sign,
            gender: row.gender,
            nationality: row.nationality,
            profession: row.profession,
            biography: row.biography,
            imageUrl: row.image_url,
            popularityScore: row.popularity_score,
            additionalData: row.additional_data ? JSON.parse(row.additional_data) : undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
}
