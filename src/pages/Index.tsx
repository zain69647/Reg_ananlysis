import { useState, useEffect, useRef } from 'react';
import { ModelType, RegressionResult } from '@/types/regression';
import {
  parseInput,
  calculateSimpleRegression,
  calculateMultipleRegression,
} from '@/services/mathService';
import Header from '@/components/Header';
import ModelSelector from '@/components/ModelSelector';
import DataInput from '@/components/DataInput';
import Results from '@/components/Results';

const Index = () => {
  const [model, setModel] = useState<ModelType>('simple');
  const [inputY, setInputY] = useState('');
  const [inputX1, setInputX1] = useState('');
  const [inputX2, setInputX2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegressionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Hypothesis testing
  const [tCrit, setTCrit] = useState('');
  const [fCrit, setFCrit] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);


  const handleModelChange = (newModel: ModelType) => {
    setModel(newModel);
    setResult(null);
    setError(null);
  };

  const handleCalculate = async () => {
    setError(null);

    const Y = parseInput(inputY);
    const X1 = parseInput(inputX1);
    const X2 = parseInput(inputX2);

    // Validation
    if (Y.length === 0 || X1.length === 0) {
      setError('Error: Input fields cannot be empty.');
      return;
    }

    if (Y.length !== X1.length) {
      setError(`Error: Mismatch lengths. Y=${Y.length}, X=${X1.length}`);
      return;
    }

    if (model === 'multiple' && X2.length !== Y.length) {
      setError(`Error: Mismatch lengths. Y=${Y.length}, X₂=${X2.length}`);
      return;
    }

    setIsCalculating(true);

    try {
      let calcResult: RegressionResult;
      if (model === 'simple') {
        calcResult = calculateSimpleRegression(Y, X1);
      } else {
        calcResult = calculateMultipleRegression(Y, X1, X2);
      }

      setResult(calcResult);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation Error');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-6 px-4 pb-8 overflow-x-hidden">
      <div className="w-full max-w-2xl space-y-6">
        <Header />

        <ModelSelector model={model} onModelChange={handleModelChange} />

        <div id="exportSection">
          <DataInput
            model={model}
            inputY={inputY}
            inputX1={inputX1}
            inputX2={inputX2}
            onInputYChange={setInputY}
            onInputX1Change={setInputX1}
            onInputX2Change={setInputX2}
            onCalculate={handleCalculate}
            onClear={() => {
              setInputY('');
              setInputX1('');
              setInputX2('');
              setResult(null);
              setError(null);
            }}
            error={error}
            isCalculating={isCalculating}
          />

          <div ref={resultsRef}>
            <Results
              result={result}
              model={model}
              tCrit={tCrit}
              fCrit={fCrit}
              onTCritChange={setTCrit}
              onFCritChange={setFCrit}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-center text-muted-foreground/30 text-xs tracking-widest uppercase animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        Developed by Mr.Zach
      </p>
    </div>
  );
};

export default Index;
