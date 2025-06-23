import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  currentMood: varchar('current_mood', { length: 50 }),
  moodScore: decimal('mood_score', { precision: 3, scale: 2 }),
  energyLevel: decimal('energy_level', { precision: 3, scale: 2 }),
  lastMoodUpdate: timestamp('last_mood_update'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const moodEntries = pgTable(
  'mood_entries',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    calculatedMoodScore: decimal('calculated_mood_score', {
      precision: 3,
      scale: 2,
    }),
    calculatedEnergyLevel: decimal('calculated_energy_level', {
      precision: 3,
      scale: 2,
    }),
    manualMoodScore: integer('manual_mood_score'),
    notes: text('notes'),
    entryDate: timestamp('entry_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('mood_entries_user_id_idx').on(table.userId),
    entryDateIdx: index('mood_entries_entry_date_idx').on(table.entryDate),
  })
);

export const musicTracks = pgTable(
  'music_tracks',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    artist: varchar('artist', { length: 255 }).notNull(),
    album: varchar('album', { length: 255 }),
    genre: varchar('genre', { length: 100 }),
    duration: integer('duration'),
    releaseYear: integer('release_year'),
    spotifyId: varchar('spotify_id', { length: 100 }),
    appleId: varchar('apple_id', { length: 100 }),
    youtubeId: varchar('youtube_id', { length: 100 }),
    imageUrl: varchar('image_url', { length: 500 }),
    previewUrl: varchar('preview_url', { length: 500 }),
    tempo: decimal('tempo', { precision: 6, scale: 2 }),
    valence: decimal('valence', { precision: 3, scale: 2 }),
    energy: decimal('energy', { precision: 3, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    titleArtistIdx: index('music_tracks_title_artist_idx').on(
      table.title,
      table.artist
    ),
    spotifyIdIdx: index('music_tracks_spotify_id_idx').on(table.spotifyId),
  })
);

export const musicListeningEntries = pgTable(
  'music_listening_entries',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    musicTrackId: integer('music_track_id')
      .references(() => musicTracks.id, { onDelete: 'cascade' })
      .notNull(),
    listenedAt: timestamp('listened_at').notNull(),
    playCount: integer('play_count').default(1),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('music_listening_entries_user_id_idx').on(table.userId),
    musicTrackIdx: index('music_listening_entries_music_track_idx').on(
      table.musicTrackId
    ),
    listenedAtIdx: index('music_listening_entries_listened_at_idx').on(
      table.listenedAt
    ),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  moodEntries: many(moodEntries),
  musicListeningEntries: many(musicListeningEntries),
}));

export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, {
    fields: [moodEntries.userId],
    references: [users.id],
  }),
}));

export const musicTracksRelations = relations(musicTracks, ({ many }) => ({
  musicListeningEntries: many(musicListeningEntries),
}));

export const musicListeningEntriesRelations = relations(
  musicListeningEntries,
  ({ one }) => ({
    user: one(users, {
      fields: [musicListeningEntries.userId],
      references: [users.id],
    }),
    musicTrack: one(musicTracks, {
      fields: [musicListeningEntries.musicTrackId],
      references: [musicTracks.id],
    }),
  })
);
