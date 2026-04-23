import { useMemo } from 'react'
import type { Hand, ScoreBoardInput, ScoreBoardOutput } from '../types'
import { getDatumForBoard, getDeclaringSide } from '../utils/datum'
import { computeDeclaringHcp, validateManualHcp } from '../utils/hcp'
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
    const declaringSide = getDeclaringSide(input.declarer)

    const declaringHcp = input.hands
      ? computeDeclaringHcp(input.hands, declaringSide)
      : input.manualDeclaringHcp

    if (declaringHcp == null || !validateManualHcp(declaringHcp)) {
      return {
        data: null,
        errorKey: 'invalidHcp' as const,
        errorMessage: null,
      }
    }

    try {

      let datumRaw = getDatumForBoard(
        declaringHcp,
        input.vulnerability,
        declaringSide,
        input.schema,
      )

      const actualScore = computeActualScore(
        input.contract,
        input.result,
        input.vulnerability,
        input.doubled,
        declaringSide,
      )

      // If declaring side has <20 HCP, compute datum for the other side and flip perspective
      if (declaringHcp < 20) {
        const otherSide = declaringSide === 'NS' ? 'EW' : 'NS'
        const otherHcp = 40 - declaringHcp
        datumRaw = getDatumForBoard(
          otherHcp,
          input.vulnerability,
          otherSide,
          input.schema,
        )
        datumRaw = -datumRaw // Flip to NS perspective
        // Do NOT flip actualScore; it should always be from NS perspective
      }

      const { datumRounded, diff, imp } = scoreBoard(actualScore, datumRaw)

      return {
        data: {
          declaringSide,
          declaringVulnerable:
            input.vulnerability === 'Both' ||
            input.vulnerability === declaringSide,
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
