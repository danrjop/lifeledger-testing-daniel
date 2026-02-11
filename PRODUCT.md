# LifeLedger

**Find everything. Miss nothing.**

## Problem Statement

Many consumers take screenshots to save important information — confirmations, receipts, subscriptions, deadlines — but cannot find this information later. Disorganized photo libraries turn a simple habit into a source of missed commitments, forgotten details, and real financial loss. Users waste money on subscriptions they forget to cancel, accrue fees from missed deadlines, and lose track of critical records buried in their camera rolls.

There is no good middle ground between a raw photos app and a full personal-finance tool. Existing solutions fail to bridge the gap between *capturing* information and *acting* on it.

## Mission

LifeLedger's mission is to reduce the cognitive and financial burden of managing everyday commitments by transforming screenshots into structured, searchable, and evidence-backed personal records. By surfacing deadlines, linking related information, and providing trustworthy answers grounded in user-owned data, LifeLedger helps people miss nothing important in their daily lives.

## Vision

A world where capturing important information in a screenshot is all it takes to stay on top of it — where deadlines surface automatically, related records connect themselves, and answers to questions like "When does my trial end?" are one search away, backed by real evidence from your own data.

## Target Customer

The primary customer is a digitally literate consumer who habitually saves information as screenshots but struggles to retrieve it. They feel the anxiety of an unorganized system and the financial sting of missed renewal dates, forgotten return windows, and overlooked subscriptions. LifeLedger takes on their cognitive load so they don't have to.

### Key Assumptions

- Customers are tech-savvy and digitally literate.
- Users are willing to share photo data containing sensitive financial and personal information.
- Existing solutions (photos apps, personal finance apps) are insufficient for this use case.
- Users will actively upload or sync their images.
- AI-powered features do not introduce unacceptable friction or learning curve.
- False positives and false negatives appear at a rate acceptable to users.

## Value Proposition

LifeLedger gives users a way to finally use the important information buried in their screenshots. It makes screenshots searchable, extracts key fields into structured and trustworthy records, automatically detects renewals, trials, and return deadlines, and provides evidence-backed answers to real questions. This reduces missed deadlines, lost information, and the frustration of scrolling endlessly through a camera roll.

## MVP Feature Set

The MVP is a web application that transforms user screenshots and photos into actionable, searchable records. It tests the core assumption that automated extraction, search, deadlines, and evidence-based answers provide strong user value.

| Feature | Description |
|---|---|
| **OCR + Key Information Extraction** | Converts images to searchable text and extracts structured fields (dates, amounts, merchants). Essential for search, deadlines, and trust. |
| **Keyword + Semantic Search** | Lets users find any screenshot instantly through both exact-match and meaning-based queries. |
| **Related Panel** | Uses embedding similarity to connect related documents (e.g., linking travel confirmations for the same trip). |
| **Deadline Radar** | Automatically surfaces trial endings, subscription renewals, and return deadlines before they pass. |
| **Agentic Router** | Answers goal-style queries by combining Search, Radar, and Related capabilities — returning evidence-backed answers, not guesses. |

## Technology

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Build / Dev | Node.js, ESLint |
