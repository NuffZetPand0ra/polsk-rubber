import { useMemo } from 'react'
import type { Hand, ScoreBoardInput, ScoreBoardOutput } from '../types'
import { getDatumForBoard, getDeclaringSide } from '../utils/datum'
import { computeDeclaringHcp, computeHandHcp, validateManualHcp } from '../utils/hcp'
import { scoreBoard } from '../utils/imp'
import { computeActualScore } from '../utils/scoring'

interface UseScoringInput extends ScoreBoardInput {
  hands?: {
    north: Hand
    east: Hand
    south: Hand
    west: Hand
  }
}

export type ScoringErrorKey = 'invalidHcp' | 'scoringFailed'

export function useScoring(input: UseScoringInput): {
  data: ScoreBoardOutput | null
  errorKey: ScoringErrorKey | null
  errorMessage: string | null
} {
  return useMemo(() => {

    // Compute both sides' HCP
    let nsHcp: number | undefined, ewHcp: number | undefined
    if (input.hands) {
      nsHcp = computeHandHcp(input.hands.north) + computeHandHcp(input.hands.south)
      ewHcp = computeHandHcp(input.hands.east) + computeHandHcp(input.hands.west)
    } else {
      // Fallback to manual HCP (assume for NS, derive EW)
      nsHcp = input.manualDeclaringHcp
      ewHcp = nsHcp != null ? 40 - nsHcp : undefined
    }

    if (
      nsHcp == null || ewHcp == null ||
      !validateManualHcp(nsHcp) || !validateManualHcp(ewHcp)
    ) {
      return {
        data: null,
        errorKey: 'invalidHcp' as const,
        errorMessage: null,
      }
    }


    // Determine which side has majority HCP
    let majoritySide: 'NS' | 'EW' = nsHcp >= ewHcp ? 'NS' : 'EW'
    let majorityHcp = majoritySide === 'NS' ? nsHcp : ewHcp

    // Compute declaring side and its HCP
    const declaringSide = getDeclaringSide(input.declarer)
    const declaringHcp = declaringSide === 'NS' ? nsHcp : ewHcp

    // Compute datum and actual score from majority side's perspective
    let datumRaw = getDatumForBoard(
      majorityHcp,
      input.vulnerability,
      majoritySide,
      input.schema,
    )


    // Compute actual score from declarer's side (never flip)
    const actualScore = computeActualScore(
      input.contract,
      input.result,
      input.vulnerability,
      input.doubled,
      declaringSide,
    )

    try {

      const { datumRounded, diff, imp } = scoreBoard(actualScore, datumRaw)

      return {
        data: {
          majoritySide,
          majorityHcp,
          declaringSide,
          declaringHcp,
          datumRaw,
          datumRounded,
          actualScore,
          diff,
          imp,
        },
        errorKey: null,
        errorMessage: null,
      }
    } catch (error) {
      return {
        data: null,
        errorKey: 'scoringFailed' as const,
        errorMessage:
          error instanceof Error ? error.message : 'Failed to score board.',
      }
    }
  }, [input])
}
