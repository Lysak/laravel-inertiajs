# Demo Project for Interview Preparation

Date: 2026-02-12

## Goal
Create a learning/demo project to prepare for interviews and understand how everything works in a real-world stack.

## Key Requirements
- **Backend:** Laravel (latest version available in 2026)
- **Frontend:** Inertia.js + React (latest versions available in 2026)
- **API:** GraphQL (latest version available in 2026)
- **Performance issues:** examples of N+1 and M+1 problems and their solutions
- **Package manager:** pnpm
- **Formatting/linting:** Biome
- **Node.js:** nvm, install the latest LTS/Stable version available in 2026, create `.nvmrc`

## First-Phase Deliverable
- A single document that clearly describes the requirements, goals, and expected architecture (this file).
- The architecture and the remaining functionality will be built based on this document.

## Planned Domain (Can Be Changed)
Proposal: *Coffee shop* — a simple domain where it is easy to demonstrate:
- one-to-many and many-to-many relationships
- GraphQL queries that can trigger N+1
- optimizations through eager loading / DataLoader

## Functional Requirements (Draft)
1. **Authentication**: basic login/register, minimal setup.
2. **CRUD**:
   - Drinks
   - Categories
   - Orders
   - Order Items
3. **GraphQL API**:
   - Minimal set of queries/mutations
   - Demonstration of N+1 and optimized alternatives
4. **UI via Inertia + React**:
   - List and detail pages
   - Example of a query that triggers N+1 and N+1 + M+1
   - Optimized query

## Non-Functional Requirements
- Standard Laravel + Inertia structure
- Biome configuration for formatting/linting
- Use pnpm for the frontend
- Startup documentation

## Technical Decisions (To Be Refined)
- GraphQL: rebing/graphql-laravel
- N+1/M+1: (describe strategies for Laravel/GraphQL)
- Tests: (minimal examples, if needed)

## Next Steps Plan
1. Agree on the domain (keep it or change it).
2. Finalize the architectural decisions.
3. Create the project structure and initial configuration.

---

*Note:* The "latest version" of each technology for 2026 should be confirmed at project start using official sources.
