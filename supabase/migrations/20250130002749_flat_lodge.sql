/*
  # Create posts table and setup RLS policies

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)
      - `published` (boolean)

  2. Security
    - Enable RLS on `posts` table
    - Add policies for:
      - Authenticated users can read published posts
      - Admin users can read all posts
      - Admin users can create/update/delete posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  published boolean DEFAULT false
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy for reading published posts (public)
CREATE POLICY "Anyone can read published posts"
  ON posts
  FOR SELECT
  USING (published = true);

-- Policy for admin to read all posts
CREATE POLICY "Admin can read all posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@mmktoday.com'
  );

-- Policy for admin to insert posts
CREATE POLICY "Admin can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@mmktoday.com'
  );

-- Policy for admin to update posts
CREATE POLICY "Admin can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@mmktoday.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@mmktoday.com'
  );

-- Policy for admin to delete posts
CREATE POLICY "Admin can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@mmktoday.com'
  );