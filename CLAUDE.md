# CLAUDE.md

This project's conventions, stack, commands, and data model are documented in
**[AGENTS.md](./AGENTS.md)**. Read it first.

Product spec and design docs live in [`planning/`](./planning/):

- [`planning/SPEC.md`](./planning/SPEC.md) — product spec, features, ranking, copy voice
- [`planning/DATA_MODEL.md`](./planning/DATA_MODEL.md) — the trophy data file schema
- [`planning/mockups/`](./planning/mockups/) — HTML UI mockups (open in a browser)

Quick reminders:

- Yarn, not npm. `yarn dev` / `yarn build` / `yarn lint`.
- No database — data is the committed text file `data/trophies.csv`.
- Only the **top-tier league** and the **Champions League** count as "real trophies".
- Keep the copy cheeky and the numbers ticking live.
