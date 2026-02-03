export interface Coefficient {
  name: string;
  value: number;
  se: number;
  t: number;
}

export interface SimpleRegressionResult {
  n: number;
  meanY: number;
  meanX1: number;
  sumY: number;
  sumX1: number;
  sumY2: number;
  sumX1_2: number;
  sumX1Y: number;
  Sxx: number;
  Syy: number;
  Sxy: number;
  formula: string;
  TSS: number;
  ESS: number;
  RSS: number;
  R2: number;
  AdjR2: number;
  sigma2: number;
  F: number;
  coefficients: Coefficient[];
}

export interface MultipleRegressionResult {
  n: number;
  meanY: number;
  meanX1: number;
  meanX2: number;
  sumY: number;
  sumX1: number;
  sumX2: number;
  sumY2: number;
  sumX1_2: number;
  sumX2_2: number;
  sumX1Y: number;
  sumX2Y: number;
  sumX1X2: number;
  formula: string;
  TSS: number;
  ESS: number;
  RSS: number;
  R2: number;
  AdjR2: number;
  sigma2: number;
  F: number;
  coefficients: Coefficient[];
}

export type RegressionResult = SimpleRegressionResult | MultipleRegressionResult;

export type ModelType = 'simple' | 'multiple';
