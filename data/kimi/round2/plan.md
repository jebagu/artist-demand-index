# Plan: Sonic Sphere Artist Demand Dashboard — Missing Data Enrichment

## Task Overview
Fill missing factual fields for 119 artists in the Sonic Sphere Artist Demand Dashboard using public, cited data. The prompt specifies 7 priority levels. We'll process sequentially, one priority at a time, starting with Priority 1.

## Stage 1 — Research: Priority 1 (Spotify Followers)
- **Skill**: `deep-research-swarm` (Route B — Focused Search)
- **Scope**: 53 artists missing `spotifyFollowers`
- **Approach**: Deploy parallel researcher agents, each handling a batch of ~10 artists
- **Output**: Raw research notes with follower counts, source URLs, confidence levels

## Stage 2 — Assembly: Priority 1 Deliverables
- Compile research into the required JSON/CSV/MD schema
- Validate data quality and flag ambiguous cases
- Output: `artist_updates_p1.json`, `sources_p1.csv`, `conflicts_p1.json`, `research_summary_p1.md`

## Stage 3+ — Repeat for Priorities 2-7 (if needed)
- Continue with Priority 2 (social data, 113 artists) if time permits
- The prompt says to deliver one priority at a time if output is large

## Current Stage
**Stage 1**: Priority 1 — Researching Spotify followers for 53 artists.
