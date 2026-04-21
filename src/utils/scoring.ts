import type { Doubled, Side, Suit, Vulnerability } from '../types'
import { isSideVulnerable } from './datum'

interface ParsedContract {
  level: number
  suit: Suit
}

const CONTRACT_REGEX = /^([1-7])(C|D|H|S|NT)$/i

function parseContract(contract: string): ParsedContract {
  const cleaned = contract.trim().toUpperCase()
  const match = cleaned.match(CONTRACT_REGEX)

  if (!match) {
    throw new Error('Contract must be one of 1C-7NT')
  }

  return {
    level: Number(match[1]),
    suit: match[2] as Suit,
  }
}

function doubledMultiplier(doubled: Doubled): number {
  if (doubled === 'XX') {
    return 4
  }

  if (doubled === 'X') {
    return 2
  }

  return 1
}

function trickScore(level: number, suit: Suit): number {
  if (suit === 'NT') {
    return 40 + (level - 1) * 30
  }

  if (suit === 'S' || suit === 'H') {
    return level * 30
  }

  return level * 20
}

function overTrickScore(
  overTricks: number,
  suit: Suit,
  vulnerable: boolean,
  doubled: Doubled,
): number {
  if (overTricks <= 0) {
    return 0
  }

  if (!doubled) {
    if (suit === 'S' || suit === 'H' || suit === 'NT') {
      return overTricks * 30
    }

    return overTricks * 20
  }

  if (doubled === 'X') {
    return overTricks * (vulnerable ? 200 : 100)
  }

  return overTricks * (vulnerable ? 400 : 200)
}

function madeBonus(
  contractPoints: number,
  level: number,
  vulnerable: boolean,
  doubled: Doubled,
): number {
  let bonus = contractPoints >= 100 ? (vulnerable ? 500 : 300) : 50

  if (level === 6) {
    bonus += vulnerable ? 750 : 500
  } else if (level === 7) {
    bonus += vulnerable ? 1500 : 1000
  }

  if (doubled === 'X') {
    bonus += 50
  } else if (doubled === 'XX') {
    bonus += 100
  }

  return bonus
}

function underTrickPenalty(
  underTricks: number,
  vulnerable: boolean,
  doubled: Doubled,
): number {
  if (!doubled) {
    return underTricks * (vulnerable ? 100 : 50)
  }

  const perDouble = doubled === 'XX' ? 2 : 1

  if (vulnerable) {
    if (underTricks === 1) {
      return 200 * perDouble
    }

    return (200 + (underTricks - 1) * 300) * perDouble
  }

  if (underTricks === 1) {
    return 100 * perDouble
  }

  if (underTricks <= 3) {
    return (100 + (underTricks - 1) * 200) * perDouble
  }

  return (500 + (underTricks - 3) * 300) * perDouble
}

export function computeDeclarerScore(
  contract: string,
  result: number,
  vulnerable: boolean,
  doubled: Doubled,
): number {
  const { level, suit } = parseContract(contract)

  if (result >= 0) {
    const contractPoints = trickScore(level, suit) * doubledMultiplier(doubled)
    const overPoints = overTrickScore(result, suit, vulnerable, doubled)
    return contractPoints + overPoints + madeBonus(contractPoints, level, vulnerable, doubled)
  }

  return -underTrickPenalty(Math.abs(result), vulnerable, doubled)
}

export function normalizeScoreToNsPerspective(
  declaringSide: Side,
  declarerScore: number,
): number {
  return declaringSide === 'NS' ? declarerScore : -declarerScore
}

export function computeActualScore(
  contract: string,
  result: number,
  vulnerability: Vulnerability,
  doubled: Doubled,
  declaringSide: Side,
): number {
  const declaringVulnerable = isSideVulnerable(vulnerability, declaringSide)
  const declarerScore = computeDeclarerScore(
    contract,
    result,
    declaringVulnerable,
    doubled,
  )

  return normalizeScoreToNsPerspective(declaringSide, declarerScore)
}
