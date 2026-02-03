import { RegressionResult, ModelType, SimpleRegressionResult } from '@/types/regression';
import StatItem from './StatItem';
import HypothesisSection from './HypothesisSection';
import { cn } from '@/lib/utils';
interface ResultsProps {
  result: RegressionResult | null;
  model: ModelType;
  tCrit: string;
  fCrit: string;
  onTCritChange: (value: string) => void;
  onFCritChange: (value: string) => void;
}

const Results = ({
  result,
  model,
  tCrit,
  fCrit,
  onTCritChange,
  onFCritChange,
}: ResultsProps) => {
  const tCritNum = parseFloat(tCrit);
  const fCritNum = parseFloat(fCrit);
  const hasTCrit = !isNaN(tCritNum);
  const hasFCrit = !isNaN(fCritNum);

  const isSimple = (r: RegressionResult): r is SimpleRegressionResult => {
    return 'Sxx' in r;
  };

  const getFSignificance = () => {
    if (!result || !hasFCrit) return null;
    return result.F > fCritNum;
  };

  const getTSignificance = (tVal: number) => {
    if (!hasTCrit) return null;
    return Math.abs(tVal) > tCritNum;
  };

  const fIsSignificant = getFSignificance();

  return (
    <div
      className="bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in-up mb-8 transition-all duration-500 hover:shadow-card-hover"
      id="resultsCard"
      style={{ animationDelay: '300ms' }}
    >
      <div className="flex items-center justify-between border-b-2 border-muted pb-3 mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center font-bold animate-bounce-in" style={{ animationDelay: '400ms' }}>3</span>
          Results
          {result && (
            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full animate-bounce-in ml-2">
              ✓ Calculated
            </span>
          )}
        </h2>
      </div>

      {!result ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-muted bg-muted/50">
          <p className="text-muted-foreground italic animate-pulse-subtle">
            Results will appear here after calculation.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Data Summary */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Data
              Summary (n={result.n})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatItem label="mean(Y)" value={result.meanY} delay={50} />
              <StatItem
                label={model === 'multiple' ? 'mean(X₁)' : 'mean(X)'}
                value={result.meanX1}
                delay={100}
              />
              {'meanX2' in result && (
                <StatItem label="mean(X₂)" value={result.meanX2} delay={150} />
              )}
              <StatItem label="ΣY" value={result.sumY} delay={200} />
              <StatItem
                label={model === 'multiple' ? 'ΣX₁' : 'ΣX'}
                value={result.sumX1}
                delay={250}
              />
              {'sumX2' in result && (
                <StatItem label="ΣX₂" value={result.sumX2} delay={300} />
              )}
              <StatItem label="ΣY²" value={result.sumY2} delay={350} />
              <StatItem
                label={model === 'multiple' ? 'ΣX₁²' : 'ΣX²'}
                value={result.sumX1_2}
                delay={400}
              />
              {'sumX2_2' in result && (
                <StatItem label="ΣX₂²" value={result.sumX2_2} delay={450} />
              )}
              <StatItem
                label={model === 'multiple' ? 'ΣX₁Y' : 'ΣXY'}
                value={result.sumX1Y}
                delay={500}
              />
              {'sumX2Y' in result && (
                <StatItem label="ΣX₂Y" value={result.sumX2Y} delay={550} />
              )}
              {'sumX1X2' in result && (
                <StatItem label="ΣX₁X₂" value={result.sumX1X2} delay={600} />
              )}
            </div>
          </div>

          {/* Deviation Sums (Simple only) */}
          {isSimple(result) && (
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{' '}
                Deviation Sums
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <StatItem label="Sxx" value={result.Sxx} delay={650} />
                <StatItem label="Syy" value={result.Syy} delay={700} />
                <StatItem label="Sxy" value={result.Sxy} delay={750} />
              </div>
            </div>
          )}

          {/* Model */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />{' '}
              Regression Model
            </h4>
            <div className="bg-gradient-to-r from-accent via-secondary to-accent text-foreground p-4 rounded-xl font-mono text-xs md:text-sm font-bold text-center border border-border mb-6 break-all shadow-inner relative overflow-hidden group bg-[length:200%_100%]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10">{result.formula}</span>
            </div>

            {/* ANOVA */}
            <h4 className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Analysis
                of Variance
              </div>
              {hasFCrit && (
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm animate-pop',
                    fIsSignificant
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-100 text-rose-700 border border-rose-200'
                  )}
                >
                  {fIsSignificant ? 'Reject H₀' : 'Fail to Reject H₀'}
                </span>
              )}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatItem label="TSS" value={result.TSS} delay={800} />
              <StatItem label="ESS" value={result.ESS} delay={850} />
              <StatItem label="RSS" value={result.RSS} delay={900} />
              <div
                className={cn(
                  'rounded-xl transition-all duration-300',
                  hasFCrit &&
                    (fIsSignificant
                      ? 'ring-2 ring-emerald-400 bg-emerald-500/10'
                      : 'ring-2 ring-rose-300 bg-rose-500/10')
                )}
              >
                <StatItem label="F-stat" value={result.F} delay={950} />
              </div>
              <StatItem label="R²" value={result.R2} delay={1000} />
              <StatItem label="Adj R²" value={result.AdjR2} delay={1050} />
              <StatItem label="σ² (Resid)" value={result.sigma2} delay={1100} />
            </div>
          </div>

          {/* Coefficients Table */}
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{' '}
              Coefficients & Inference
            </h4>
            <div className="overflow-hidden rounded-xl border border-border shadow-sm bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-4 px-4 text-left">Var</th>
                      <th className="py-4 px-4">Coef</th>
                      <th className="py-4 px-4">SE</th>
                      <th className="py-4 px-4">t-stat</th>
                      <th className="py-4 px-4 text-center">
                        H₀ Decision
                        {hasTCrit && (
                          <span className="block text-[10px] font-normal">
                            (vs {tCritNum})
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground divide-y divide-border">
                    {result.coefficients.map((c) => {
                      const tSig = getTSignificance(c.t);
                      return (
                        <tr
                          key={c.name}
                          className="hover:bg-muted/50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4 text-left font-bold text-foreground">
                            {c.name}
                          </td>
                          <td className="py-4 px-4">{c.value.toFixed(4)}</td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {c.se.toFixed(4)}
                          </td>
                          <td
                            className={cn(
                              'py-4 px-4 font-bold',
                              hasTCrit
                                ? tSig
                                  ? 'text-emerald-600'
                                  : 'text-rose-500'
                                : 'text-foreground'
                            )}
                          >
                            {c.t.toFixed(4)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {hasTCrit && (
                              <span
                                className={cn(
                                  'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm animate-pop',
                                  tSig
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-700 border border-rose-200'
                                )}
                              >
                                {tSig ? 'Reject H₀' : 'Fail to Reject H₀'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Hypothesis Testing Section */}
          <HypothesisSection
            tCrit={tCrit}
            fCrit={fCrit}
            onTCritChange={onTCritChange}
            onFCritChange={onFCritChange}
            fStat={result.F}
          />
        </div>
      )}
    </div>
  );
};

export default Results;
