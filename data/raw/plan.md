# Sonic Sphere Artist Demand Research — Execution Plan

## Overview
Research 119 artists across streaming, social media, touring, certifications, and cultural heat metrics. Produce an 11-tab Excel spreadsheet + written summary.

## Stage 1: Research Skill Loading & Agent Setup
- Load `deep-research-swarm` skill for research methodology
- Load `xlsx` skill for final spreadsheet production
- Create specialized research subagents

## Stage 2: Parallel Artist Research (Batched)
Split 119 artists into batches of ~10 artists each (~12 batches).
For each batch, deploy parallel agents researching:
- **Streaming & Catalog**: Spotify monthly listeners, followers, top tracks, catalog info
- **Social Media**: Instagram, X/Twitter, Facebook followers
- **Live & Touring**: Bandsintown followers, recent tours, venue scales, grosses
- **Sales & Certifications**: RIAA, BPI certifications, record sales
- **Press & Cultural Heat**: Recent press, awards, Google Trends, cultural moments

Batches:
- Batch 1: 1-10 (Acid Pauli through Beyoncé)
- Batch 2: 11-20 (Bicep through Charli XCX)
- Batch 3: 21-30 (Chemical Brothers through DeLaurentis)
- Batch 4: 31-40 (Ellie Goulding through Fred Again)
- Batch 5: 41-50 (Future through Holly Herndon)
- Batch 6: 51-60 (Ian Dearden through Kaitlyn Aurelia Smith)
- Batch 7: 61-70 (Karlheinz Stockhausen through Madonna)
- Batch 8: 71-80 (Maribou State through Naomi Jon)
- Batch 9: 81-90 (Nicolas Jaar through Rival Consoles)
- Batch 10: 91-100 (Robyn through Steven Wilson)
- Batch 11: 101-110 (Stevie Nicks through Tipper)
- Batch 12: 111-119 (Tourist through yunè pinku)

## Stage 3: Data Aggregation & Normalization
- Merge all batch results into unified datasets
- Normalize metrics using log percentile normalization (0-100)
- Build all 11 spreadsheet tabs
- Flag missing/conflicting data

## Stage 4: Spreadsheet Production
- Use `xlsx` skill to produce the final Excel file
- Format professionally with proper styling

## Stage 5: Written Summary
- Compile summary of findings, caveats, and recommendations

## Key Constraints
- Current date: 2026-05-12
- Do NOT calculate final Star Power / Desire score
- Source every number with confidence ratings
- Distinguish N/A from zero
- Use log normalization: log10(raw_value + 1) → percentile rank 0-100
