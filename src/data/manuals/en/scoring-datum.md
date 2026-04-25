# Scoring and Datum

The app calculates IMP from the difference between actual score and datum score.

## Inputs Used

- Contract level and suit
- Declarer
- Result (over/under tricks)
- Vulnerability
- Doubled or redoubled
- N/S HCP

## Datum Lookup

1. Select active datum schema.
2. Find HCP row.
3. If exact HCP row is missing, use nearest lower row.
4. Choose non-vul or vul column.

## IMP Difference

- Diff = Actual score (NS) - Datum score
- IMP is derived from diff by IMP table conversion.

## Why Schema Choice Matters

Different schemas represent different club standards, so the same board can produce slightly different datum and IMP.
