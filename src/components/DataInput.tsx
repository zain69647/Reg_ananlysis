import { ModelType } from '@/types/regression';
import { parseInput } from '@/services/mathService';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface DataInputProps {
  model: ModelType;
  inputY: string;
  inputX1: string;
  inputX2: string;
  onInputYChange: (value: string) => void;
  onInputX1Change: (value: string) => void;
  onInputX2Change: (value: string) => void;
  onCalculate: () => void;
  onClear: () => void;
  error: string | null;
  isCalculating: boolean;
}

const DataInput = ({
  model,
  inputY,
  inputX1,
  inputX2,
  onInputYChange,
  onInputX1Change,
  onInputX2Change,
  onCalculate,
  onClear,
  error,
  isCalculating,
}: DataInputProps) => {
  const hasData = inputY.trim() !== '' || inputX1.trim() !== '' || inputX2.trim() !== '';
  const yCount = parseInput(inputY).length;
  const x1Count = parseInput(inputX1).length;
  const x2Count = parseInput(inputX2).length;
  const xLabel = model === 'multiple' ? 'X₁' : 'X';

  return (
    <div
      id="dataInputSection"
      className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-in-right hover:shadow-card-hover transition-all duration-300"
      style={{ animationDelay: '200ms' }}
    >
      <h2 className="text-lg font-bold text-foreground border-b-2 border-muted pb-2 mb-4 flex items-center gap-2">
        <span className="inline-block w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center font-bold animate-bounce-in" style={{ animationDelay: '300ms' }}>2</span>
        Enter Data
      </h2>

      <div className="bg-sky-50 border-l-4 border-primary p-3 rounded-r-lg mb-6 text-sm text-slate-700 shadow-sm animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <strong>Tip:</strong> Enter numbers vertically (like a column) or
        separated by spaces/commas.
      </div>

      <div className="space-y-6">
        <div className="relative group animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <label className="block mb-2 font-semibold text-slate-700 text-sm ml-1">
            Values for Y (Dependent)
          </label>
          <textarea
            value={inputY}
            onChange={(e) => onInputYChange(e.target.value)}
            className="w-full h-28 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-base focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-y placeholder-slate-300 custom-scrollbar hover:border-slate-300"
            placeholder={"6\n4\n3\n5"}
          />
        </div>

        <div className="relative group animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <label className="block mb-2 font-semibold text-slate-700 text-sm ml-1">
            Values for {model === 'multiple' ? 'X₁' : 'X'}
          </label>
          <textarea
            value={inputX1}
            onChange={(e) => onInputX1Change(e.target.value)}
            className="w-full h-28 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-base focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-y placeholder-slate-300 custom-scrollbar hover:border-slate-300"
            placeholder={"1\n2\n3\n4"}
          />
        </div>

        {model === 'multiple' && (
          <div className="relative group animate-bounce-in">
            <label className="block mb-2 font-semibold text-slate-700 text-sm ml-1">
              Values for X₂
            </label>
            <textarea
              value={inputX2}
              onChange={(e) => onInputX2Change(e.target.value)}
              className="w-full h-28 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-base focus:outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-300 resize-y placeholder-slate-300 custom-scrollbar hover:border-slate-300"
              placeholder={"2\n5\n2\n6"}
            />
          </div>
        )}
      </div>

      {/* Count Display */}
      <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold p-3 rounded-xl text-center transition-all duration-300 hover:bg-amber-100 hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        n(Y) = {yCount} , n({xLabel}) = {x1Count}
        {model === 'multiple' && ` , n(X₂) = ${x2Count}`}
      </div>

      {/* Error Box */}
      {error && (
        <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium p-4 rounded-xl text-center animate-wiggle shadow-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
        {hasData && (
          <button
            onClick={onClear}
            className="px-4 py-4 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-semibold rounded-xl border-2 border-slate-200 hover:border-rose-200 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            title="Clear all inputs"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className={cn(
            'flex-1 py-4 bg-gradient-to-r from-primary to-sky-600 text-primary-foreground font-bold rounded-xl shadow-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-primary-hover active:translate-y-0 active:scale-[0.98] relative overflow-hidden group',
            isCalculating && 'opacity-70 cursor-not-allowed'
          )}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10">{isCalculating ? 'CALCULATING...' : 'CALCULATE STATS'}</span>
        </button>
      </div>
    </div>
  );
};

export default DataInput;
