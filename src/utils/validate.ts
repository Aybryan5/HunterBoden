import { Patch, Record, ValidatedSet, ValidationError } from "../types/types";
import { PublicKey } from "@solana/web3.js";

function indexToLineNumber(index: number): number {
  return index + 2;
}

export function detectDuplicates(tokens: Record[]): number {
  let errorCount = 0;
  const map = new Map();
  tokens.forEach((token, i) => {
    if (map.has(token.Mint)) {
      console.log(ValidationError.DUPLICATE_MINT)
      console.log("Existing", map.get(token.Mint), "Duplicate", `(line ${indexToLineNumber(i)})`, token);
      errorCount++;
    } else {
      map.set(token.Mint, token);
    }
  });
  return errorCount;
}

export function detectDuplicateSymbol(tokens: Record[]): number {
  const map = new Map();
  let errorCount = 0;
  tokens.forEach((token, i) => {
    if (map.has(token.Symbol)) {
      console.log(ValidationError.DUPLICATE_SYMBOL)
      console.log("Existing", map.get(token.Symbol), "Duplicate", `(line ${indexToLineNumber(i)})`, token);
      errorCount++;
    } else {
      map.set(token.Symbol, token);
    }
  });
  return errorCount;
}

export function canOnlyAddOneToken(prevTokens: Record[], tokens: Record[]): number {
  let errorCount = 0;
  const diffLength = tokens.length - prevTokens.length;

  if (diffLength > 1) {
    console.log(ValidationError.MULTIPLE_TOKENS);
    const offendingTokens: Record[] = [];
    for (let i = prevTokens.length; i < tokens.length; i++) {
      offendingTokens.push(tokens[i]);
    }
    console.log('Offending Tokens: ', offendingTokens);
    errorCount++;
  }
  return errorCount;
}

export function validMintAddress(tokens: Record[]): number {
  let errorCount = 0;

  tokens.forEach((token, i) => {
    try {
      // new PublicKey() can throw an error if the mint address is really invalid
      const pk = new PublicKey(token.Mint)
      // const isOnCurve = PublicKey.isOnCurve(pk)
      // if (!isOnCurve) {
      //   console.log(ValidationError.INVALID_MINT, `(line ${indexToLineNumber(i)})`, token);
      //   errorCount++;
      // }
    } catch (error) {
      console.log(ValidationError.INVALID_MINT, `(line ${indexToLineNumber(i)})`, token, error);
      errorCount++;
    }
  });
  return errorCount;
}

export function validDecimals(tokens: Record[]): number {
  let errorCount = 0;
  tokens.forEach((token) => {
    if (isNaN(Number(token.Decimals)) || Number(token.Decimals) < 0 || Number(token.Decimals) > 9) {
      console.log(ValidationError.INVALID_DECIMALS, token);
      errorCount++;
    }
  });
  return errorCount;
}

export function validCommunityValidated(tokens: Record[]): number {
  let errorCount = 0;
  tokens.forEach((token, i) => {
    if (token["Community Validated"] !== "true") {
      console.log(ValidationError.INVALID_COMMUNITY_VALIDATED, `(line ${indexToLineNumber(i)})`, token);
      errorCount++;
    }
  });
  return errorCount;
}

export function areRecordsEqual(r1: Record, r2: Record): boolean {
  return (
    r1.Name === r2.Name &&
    r1.Symbol === r2.Symbol &&
    r1.Mint === r2.Mint &&
    r1.Decimals === r2.Decimals &&
    r1.LogoURI === r2.LogoURI &&
    r1["Community Validated"] === r2["Community Validated"]
  );
}