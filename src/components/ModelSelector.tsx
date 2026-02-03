import { ModelType } from '@/types/regression';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  model: ModelType;
  onModelChange: (model: ModelType) => void;
}

const ModelSelector = ({ model, onModelChange }: ModelSelectorProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-slide-in-left hover:shadow-card-hover transition-all duration-300" style={{ animationDelay: '100ms' }}>
      <h2 className="text-lg font-bold text-foreground border-b-2 border-muted pb-2 mb-4 flex items-center gap-2">
        <span className="inline-block w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center font-bold animate-bounce-in">1</span>
        Choose Model
      </h2>
      <div className="flex flex-col gap-2">
        <div
          onClick={() => onModelChange('simple')}
          className={cn(
            'flex items-center gap-3 cursor-pointer group p-3 rounded-xl border transition-all duration-300 transform hover:scale-[1.02]',
            model === 'simple'
              ? 'bg-accent border-sky-200 shadow-sm'
              : 'bg-transparent border-transparent hover:bg-muted hover:border-border'
          )}
        >
          <div className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300',
            model === 'simple' ? 'border-primary bg-primary' : 'border-slate-300 group-hover:border-primary'
          )}>
            {model === 'simple' && (
              <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pop" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors',
              model === 'simple'
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-primary'
            )}
          >
            Simple Regression (Y on X)
          </span>
        </div>
        <div
          onClick={() => onModelChange('multiple')}
          className={cn(
            'flex items-center gap-3 cursor-pointer group p-3 rounded-xl border transition-all duration-300 transform hover:scale-[1.02]',
            model === 'multiple'
              ? 'bg-accent border-sky-200 shadow-sm'
              : 'bg-transparent border-transparent hover:bg-muted hover:border-border'
          )}
        >
          <div className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300',
            model === 'multiple' ? 'border-primary bg-primary' : 'border-slate-300 group-hover:border-primary'
          )}>
            {model === 'multiple' && (
              <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pop" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors',
              model === 'multiple'
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-primary'
            )}
          >
            Multiple Regression (Y on X₁, X₂)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
