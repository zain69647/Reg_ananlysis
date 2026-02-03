import { SimpleRegressionResult, MultipleRegressionResult } from '@/types/regression';

// Utility functions
export const parseInput = (val: string): number[] => {
  if (!val) return [];
  return val
    .split(/[\s,]+/)
    .filter((x) => x.trim() !== '')
    .map((x) => Number(x))
    .filter((x) => !isNaN(x));
};

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
const mean = (arr: number[]): number => sum(arr) / arr.length;
const sumSq = (arr: number[]): number => arr.reduce((a, b) => a + b * b, 0);
const sumProd = (arr1: number[], arr2: number[]): number =>
  arr1.reduce((acc, val, i) => acc + val * arr2[i], 0);

// Matrix operations
type Matrix = number[][];

const matMul = (A: Matrix, B: Matrix): Matrix => {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const C: Matrix = Array(m)
    .fill(0)
    .map(() => Array(p).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
};

const transpose = (A: Matrix): Matrix => {
  const m = A.length;
  const n = A[0].length;
  const T: Matrix = Array(n)
    .fill(0)
    .map(() => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      T[j][i] = A[i][j];
    }
  }
  return T;
};

const invert3x3 = (m: Matrix): Matrix | null => {
  const det =
    m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  if (Math.abs(det) < 1e-12) return null;

  const invdet = 1 / det;
  const minv: Matrix = Array(3)
    .fill(0)
    .map(() => Array(3).fill(0));

  minv[0][0] = (m[1][1] * m[2][2] - m[2][1] * m[1][2]) * invdet;
  minv[0][1] = (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invdet;
  minv[0][2] = (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invdet;
  minv[1][0] = (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invdet;
  minv[1][1] = (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invdet;
  minv[1][2] = (m[1][0] * m[0][2] - m[0][0] * m[1][2]) * invdet;
  minv[2][0] = (m[1][0] * m[2][1] - m[2][0] * m[1][1]) * invdet;
  minv[2][1] = (m[2][0] * m[0][1] - m[0][0] * m[2][1]) * invdet;
  minv[2][2] = (m[0][0] * m[1][1] - m[1][0] * m[0][1]) * invdet;

  return minv;
};

export const calculateSimpleRegression = (
  Y: number[],
  X: number[]
): SimpleRegressionResult => {
  const n = Y.length;
  const sY = sum(Y);
  const sX = sum(X);
  const sY2 = sumSq(Y);
  const sX2 = sumSq(X);
  const sXY = sumProd(X, Y);

  const meanY = sY / n;
  const meanX = sX / n;

  // Deviations
  const Sxx = sX2 - (sX * sX) / n;
  const Syy = sY2 - (sY * sY) / n;
  const Sxy = sXY - (sX * sY) / n;

  // Coefficients
  const b1 = Sxx !== 0 ? Sxy / Sxx : 0;
  const b0 = meanY - b1 * meanX;

  // Goodness of Fit
  let ESS = 0;
  let RSS = 0;
  for (let i = 0; i < n; i++) {
    const y_hat = b0 + b1 * X[i];
    const resid = Y[i] - y_hat;
    ESS += Math.pow(y_hat - meanY, 2);
    RSS += Math.pow(resid, 2);
  }

  const TSS = Syy;
  const R2 = TSS !== 0 ? ESS / TSS : 0;
  const AdjR2 = n > 2 ? 1 - RSS / (n - 2) / (TSS / (n - 1)) : 0;
  const sigma2 = n > 2 ? RSS / (n - 2) : 0;

  const se_b1 = Sxx > 0 && sigma2 >= 0 ? Math.sqrt(sigma2 / Sxx) : 0;
  const se_b0 =
    Sxx > 0 && sigma2 >= 0
      ? Math.sqrt(sigma2 * (1 / n + (meanX * meanX) / Sxx))
      : 0;

  const t_b0 = se_b0 !== 0 ? b0 / se_b0 : 0;
  const t_b1 = se_b1 !== 0 ? b1 / se_b1 : 0;

  const F = RSS > 0 && n > 2 ? ESS / 1 / (RSS / (n - 2)) : 0;

  return {
    n,
    meanY,
    meanX1: meanX,
    sumY: sY,
    sumX1: sX,
    sumY2: sY2,
    sumX1_2: sX2,
    sumX1Y: sXY,
    Sxx,
    Syy,
    Sxy,
    formula: `Ŷ = ${b0.toFixed(4)} ${b1 >= 0 ? '+' : ''} ${b1.toFixed(4)}X`,
    TSS,
    ESS,
    RSS,
    R2,
    AdjR2,
    sigma2,
    F,
    coefficients: [
      { name: 'Intercept', value: b0, se: se_b0, t: t_b0 },
      { name: 'X', value: b1, se: se_b1, t: t_b1 },
    ],
  };
};

export const calculateMultipleRegression = (
  Y_arr: number[],
  X1_arr: number[],
  X2_arr: number[]
): MultipleRegressionResult => {
  const n = Y_arr.length;
  const k = 3;

  const X: Matrix = [];
  const Y: Matrix = [];
  for (let i = 0; i < n; i++) {
    X.push([1, X1_arr[i], X2_arr[i]]);
    Y.push([Y_arr[i]]);
  }

  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const XtX_inv = invert3x3(XtX);

  if (!XtX_inv) throw new Error('Calculation Error: Matrix Singular.');

  const XtY = matMul(Xt, Y);
  const Beta = matMul(XtX_inv, XtY);

  const b0 = Beta[0][0];
  const b1 = Beta[1][0];
  const b2 = Beta[2][0];

  const sY = sum(Y_arr);
  const sX1 = sum(X1_arr);
  const sX2 = sum(X2_arr);
  const sY2 = sumSq(Y_arr);
  const sX1sq = sumSq(X1_arr);
  const sX2sq = sumSq(X2_arr);
  const sX1Y = sumProd(X1_arr, Y_arr);
  const sX2Y = sumProd(X2_arr, Y_arr);
  const sX1X2 = sumProd(X1_arr, X2_arr);

  const meanY = sY / n;
  const meanX1 = sX1 / n;
  const meanX2 = sX2 / n;

  let ESS = 0;
  let RSS = 0;
  for (let i = 0; i < n; i++) {
    const y_hat = b0 + b1 * X1_arr[i] + b2 * X2_arr[i];
    const resid = Y_arr[i] - y_hat;
    ESS += Math.pow(y_hat - meanY, 2);
    RSS += Math.pow(resid, 2);
  }

  const TSS = sumSq(Y_arr.map((y) => y - meanY));
  const R2 = TSS !== 0 ? ESS / TSS : 0;
  const AdjR2 = n > k ? 1 - RSS / (n - k) / (TSS / (n - 1)) : 0;
  const sigma2 = n > k ? RSS / (n - k) : 0;
  const F = RSS > 0 && n > k ? ESS / (k - 1) / (RSS / (n - k)) : 0;

  const SE_b0 = sigma2 >= 0 ? Math.sqrt(sigma2 * XtX_inv[0][0]) : 0;
  const SE_b1 = sigma2 >= 0 ? Math.sqrt(sigma2 * XtX_inv[1][1]) : 0;
  const SE_b2 = sigma2 >= 0 ? Math.sqrt(sigma2 * XtX_inv[2][2]) : 0;

  return {
    n,
    meanY,
    meanX1,
    meanX2,
    sumY: sY,
    sumX1: sX1,
    sumX2: sX2,
    sumY2: sY2,
    sumX1_2: sX1sq,
    sumX2_2: sX2sq,
    sumX1Y: sX1Y,
    sumX2Y: sX2Y,
    sumX1X2: sX1X2,
    formula: `Ŷ = ${b0.toFixed(4)} ${b1 >= 0 ? '+' : ''} ${b1.toFixed(4)}X₁ ${b2 >= 0 ? '+' : ''} ${b2.toFixed(4)}X₂`,
    TSS,
    ESS,
    RSS,
    R2,
    AdjR2,
    sigma2,
    F,
    coefficients: [
      { name: 'Intercept', value: b0, se: SE_b0, t: SE_b0 !== 0 ? b0 / SE_b0 : 0 },
      { name: 'X₁', value: b1, se: SE_b1, t: SE_b1 !== 0 ? b1 / SE_b1 : 0 },
      { name: 'X₂', value: b2, se: SE_b2, t: SE_b2 !== 0 ? b2 / SE_b2 : 0 },
    ],
  };
};
