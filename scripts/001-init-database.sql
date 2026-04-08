-- BlinkShare Database Migration
-- Version: 001
-- Description: Initial database setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
    CREATE TYPE airdrop_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('PAYMENT', 'TRANSFER', 'REFUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE network AS ENUM ('SOLANA', 'ETHEREUM', 'BITCOIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blink_type AS ENUM ('PAYMENT', 'DONATION', 'GIFT', 'NFT', 'SUBSCRIPTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blink_status AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE currency AS ENUM ('SOL', 'USDC', 'BARK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Users table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "discordId" VARCHAR(255) UNIQUE,
    "telegramId" VARCHAR(255) UNIQUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_discord_telegram ON "User"("discordId", "telegramId");

-- Create Server table
CREATE TABLE IF NOT EXISTS "Server" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    "discordId" VARCHAR(255) UNIQUE NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_server_discord ON "Server"("discordId");

-- Create Guild table
CREATE TABLE IF NOT EXISTS "Guild" (
    "guildId" VARCHAR(255) PRIMARY KEY,
    "guildName" VARCHAR(255) NOT NULL,
    "guildOwnerId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guild_owner ON "Guild"("guildOwnerId");

-- Create BlinkCategory table
CREATE TABLE IF NOT EXISTS "BlinkCategory" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Create BlinkTag table
CREATE TABLE IF NOT EXISTS "BlinkTag" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Blink table
CREATE TABLE IF NOT EXISTS "Blink" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "serverId" UUID NOT NULL REFERENCES "Server"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    type blink_type NOT NULL,
    amount DECIMAL(18, 6),
    currency currency NOT NULL,
    status blink_status DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMPTZ,
    "categoryId" UUID REFERENCES "BlinkCategory"(id),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blink_user_server_status ON "Blink"("userId", "serverId", status);

-- Create BlinkTemplate table
CREATE TABLE IF NOT EXISTS "BlinkTemplate" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    type blink_type NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blink_template_user ON "BlinkTemplate"("userId");

-- Create Wallet table
CREATE TABLE IF NOT EXISTS "Wallet" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "walletAddress" VARCHAR(255) NOT NULL,
    network network DEFAULT 'SOLANA',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("userId", "walletAddress", network)
);

CREATE INDEX IF NOT EXISTS idx_wallet_user_network ON "Wallet"("userId", network);

-- Create UserRole table
CREATE TABLE IF NOT EXISTS "UserRole" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "serverId" UUID NOT NULL REFERENCES "Server"(id) ON DELETE CASCADE,
    role VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("userId", "serverId", role)
);

CREATE INDEX IF NOT EXISTS idx_user_role ON "UserRole"("userId", "serverId");

-- Create Transaction table
CREATE TABLE IF NOT EXISTS "Transaction" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "blinkId" UUID NOT NULL REFERENCES "Blink"(id) ON DELETE CASCADE,
    "fromUserId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "toUserId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    amount DECIMAL(18, 6) NOT NULL,
    "transactionType" transaction_type,
    status transaction_status DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transaction_users_status ON "Transaction"("fromUserId", "toUserId", status);

-- Create Airdrop table
CREATE TABLE IF NOT EXISTS "Airdrop" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "blinkId" UUID NOT NULL REFERENCES "Blink"(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    amount DECIMAL(18, 6) NOT NULL,
    status airdrop_status DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_airdrop_user_status ON "Airdrop"("userId", status);

-- Create DiscordBotInteraction table
CREATE TABLE IF NOT EXISTS "DiscordBotInteraction" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "serverId" UUID NOT NULL REFERENCES "Server"(id) ON DELETE CASCADE,
    command VARCHAR(255) NOT NULL,
    response TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discord_interaction ON "DiscordBotInteraction"("userId", "serverId", command);

-- Create TelegramBotInteraction table
CREATE TABLE IF NOT EXISTS "TelegramBotInteraction" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    command VARCHAR(255) NOT NULL,
    response TEXT,
    "telegramChatId" VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_interaction ON "TelegramBotInteraction"("userId", command);

-- Create DiscordBotEvent table
CREATE TABLE IF NOT EXISTS "DiscordBotEvent" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "eventType" VARCHAR(255) NOT NULL,
    "serverId" UUID NOT NULL REFERENCES "Server"(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discord_event ON "DiscordBotEvent"("serverId", "eventType");

-- Create TelegramBotEvent table
CREATE TABLE IF NOT EXISTS "TelegramBotEvent" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "eventType" VARCHAR(255) NOT NULL,
    "telegramChatId" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_event ON "TelegramBotEvent"("userId", "eventType");

-- Create Blink to Tag junction table
CREATE TABLE IF NOT EXISTS "_BlinkToBlinkTag" (
    "A" UUID NOT NULL REFERENCES "Blink"(id) ON DELETE CASCADE,
    "B" UUID NOT NULL REFERENCES "BlinkTag"(id) ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

CREATE INDEX IF NOT EXISTS idx_blink_tag_a ON "_BlinkToBlinkTag"("A");
CREATE INDEX IF NOT EXISTS idx_blink_tag_b ON "_BlinkToBlinkTag"("B");

-- Insert default categories
INSERT INTO "BlinkCategory" (name, description) VALUES
    ('DeFi', 'Decentralized Finance blinks'),
    ('NFT', 'NFT related blinks'),
    ('Gaming', 'Gaming and entertainment blinks'),
    ('Social', 'Social interaction blinks'),
    ('Utility', 'Utility and tool blinks'),
    ('Donation', 'Donation and charity blinks')
ON CONFLICT (name) DO NOTHING;

-- Insert default tags
INSERT INTO "BlinkTag" (name) VALUES
    ('trending'),
    ('featured'),
    ('new'),
    ('verified'),
    ('popular')
ON CONFLICT (name) DO NOTHING;
