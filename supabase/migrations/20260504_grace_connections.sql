-- Invite codes: one per user, generated on demand
CREATE TABLE IF NOT EXISTS invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  used_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS invite_codes_user_id_idx ON invite_codes(user_id);

-- Connections between users
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, recipient_id)
);

-- Grace notes (one-way faith messages)
CREATE TABLE IF NOT EXISTS grace_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note_type text NOT NULL CHECK (note_type IN ('prayer', 'scripture', 'encouragement')),
  message text NOT NULL,
  reaction text CHECK (reaction IN ('heart', 'amen')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE grace_notes ENABLE ROW LEVEL SECURITY;

-- invite_codes policies
CREATE POLICY "Users can read own invite code" ON invite_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invite code" ON invite_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read invite codes by code" ON invite_codes FOR SELECT USING (true);

-- user_connections policies
CREATE POLICY "Users can view their own connections" ON user_connections FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can create connections" ON user_connections FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Recipients can update connection status" ON user_connections FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Users can delete own connections" ON user_connections FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- grace_notes policies
CREATE POLICY "Users can view their own notes" ON grace_notes FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send notes to connections" ON grace_notes FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receivers can update reaction/read" ON grace_notes FOR UPDATE USING (auth.uid() = receiver_id);
