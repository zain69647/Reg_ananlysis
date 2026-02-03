interface HypothesisSectionProps {
  tCrit: string;
  fCrit: string;
  onTCritChange: (value: string) => void;
  onFCritChange: (value: string) => void;
  fStat: number;
}

const HypothesisSection = ({
  tCrit,
  fCrit,
  onTCritChange,
  onFCritChange,
  fStat,
}: HypothesisSectionProps) => {
  const fCritNum = parseFloat(fCrit);
  const tCritNum = parseFloat(tCrit);
  const hasFCrit = !isNaN(fCritNum);
  const hasTCrit = !isNaN(tCritNum);

  return (
    <div className="mt-8 bg-orange-50/80 rounded-2xl p-6 border border-orange-100 animate-slide-up hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h4 className="text-sm font-bold text-orange-900 flex items-center gap-2">
          <span className="text-lg">🔍</span> Hypothesis Testing Check
        </h4>
        <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
          Optional
        </span>
      </div>

      <p className="text-xs text-orange-800 mb-5 leading-relaxed">
        Enter the <strong>Critical Values</strong> from your statistical table
        (e.g., t-table or F-table) to automatically check significance.
      </p>

      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-bold text-orange-800 uppercase tracking-wide">
            Critical t-value
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="e.g. 2.306"
            value={tCrit}
            onChange={(e) => onTCritChange(e.target.value)}
            className="w-full p-3 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 bg-card transition-all duration-300 font-medium text-foreground shadow-sm"
          />
          <div className="text-[10px] text-orange-700 font-medium pl-1 h-4">
            {hasTCrit && `Checking if |t| > ${tCritNum}`}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-bold text-orange-800 uppercase tracking-wide">
            Critical F-value
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="e.g. 5.14"
            value={fCrit}
            onChange={(e) => onFCritChange(e.target.value)}
            className="w-full p-3 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 bg-card transition-all duration-300 font-medium text-foreground shadow-sm"
          />
          <div className="text-[10px] text-orange-700 font-medium pl-1 h-4">
            {hasFCrit && `Checking if F > ${fCritNum}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HypothesisSection;
