create extension if not exists pg_trgm;

create table celebrities (
  id bigint primary key generated always as identity,
  name text not null,
  date_of_birth text not null,
  date_of_death text,
  zodiac_sign text not null,
  gender text,
  nationality text,
  profession text,
  biography text,
  image_url text,
  popularity_score numeric,
  additional_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add indexes for better performance
create index celebrities_name_idx on celebrities using gin (name gin_trgm_ops);
create index celebrities_biography_idx on celebrities using gin (biography gin_trgm_ops);
create index celebrities_zodiac_sign_idx on celebrities (zodiac_sign);
create index celebrities_popularity_score_idx on celebrities (popularity_score desc);
