/*
  # Initial Schema Setup for LuxeLiving

  1. New Tables
    - `blog_categories` - Categories for blog posts
    - `blog_posts` - Blog articles
    - `blog_comments` - User comments on blog posts
    - `properties` - Property listings
    - `contact_forms` - General contact form submissions
    - `property_inquiries` - Property-specific inquiries
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authentication levels
*/

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog categories"
  ON blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage blog categories"
  ON blog_categories
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  category_id uuid REFERENCES blog_categories(id),
  author_id uuid REFERENCES auth.users(id),
  author_name text DEFAULT 'Admin',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

-- Blog Comments
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog comments"
  ON blog_comments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON blog_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON blog_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON blog_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
  ON blog_comments
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  address text NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms numeric NOT NULL,
  square_feet integer NOT NULL,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read properties"
  ON properties
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage properties"
  ON properties
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

-- Contact Forms
CREATE TABLE IF NOT EXISTS contact_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  property_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact forms"
  ON contact_forms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read contact forms"
  ON contact_forms
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

CREATE POLICY "Admins can manage contact forms"
  ON contact_forms
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

-- Property Inquiries
CREATE TABLE IF NOT EXISTS property_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert property inquiries"
  ON property_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read property inquiries"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

CREATE POLICY "Admins can manage property inquiries"
  ON property_inquiries
  USING (auth.jwt() ->> 'email' LIKE '%@admin.com');

-- Initial blog categories data
INSERT INTO blog_categories (name, slug) VALUES 
('Luxury Real Estate', 'luxury-real-estate'),
('Interior Design', 'interior-design'),
('Lifestyle', 'lifestyle'),
('Investment', 'investment');