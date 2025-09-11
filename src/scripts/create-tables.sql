-- Create database tables for movie application
-- This script will be executed to set up the initial database schema

-- Create enums
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE quality AS ENUM ('720p', '1080p', '4K');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(100)[],
  release_year INTEGER,
  duration_minutes INTEGER,
  poster_url VARCHAR(500),
  trailer_url VARCHAR(500),
  movie_file_url VARCHAR(500),
  file_size_mb INTEGER,
  quality quality,
  upload_date TIMESTAMP DEFAULT NOW(),
  uploader_id UUID REFERENCES users(id),
  download_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  movie_id UUID REFERENCES movies(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  movie_id UUID REFERENCES movies(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  movie_id UUID REFERENCES movies(id) NOT NULL,
  download_date TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent VARCHAR(500)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movies_quality ON movies(quality);
CREATE INDEX IF NOT EXISTS idx_movies_upload_date ON movies(upload_date);
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_movie_id ON downloads(movie_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
