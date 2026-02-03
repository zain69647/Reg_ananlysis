import { Sparkles, Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';

const Header = () => {
  const handleDownloadApp = () => {
    const link = document.createElement('a');
    link.href = '/Reg-Wizard.apk';
    link.download = 'Reg-Wizard.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-6 mt-4 animate-fade-in-up">
      {/* Title Section */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-primary animate-float" style={{ animationDelay: '0ms' }} />
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight animate-slide-in-left">
            Regression Wizard
          </h1>
          <Sparkles className="w-6 h-6 text-primary animate-float" style={{ animationDelay: '150ms' }} />
        </div>
        <p className="text-muted-foreground text-sm md:text-base font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Verify your manual calculations
        </p>
      </div>

      {/* Actions Row - APK left, Theme right */}
      <div className="flex justify-between items-center animate-bounce-in" style={{ animationDelay: '300ms' }}>
        {/* Download Button - Left */}
        <div className="relative group">
          {/* Glowing ring effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-lg blur opacity-60 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadApp}
            className="relative gap-1.5 text-xs bg-background border-primary/50 hover:border-primary"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">Download App</span>
            <span className="sm:hidden">APK</span>
          </Button>
        </div>

        {/* Theme Toggle - Right */}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
