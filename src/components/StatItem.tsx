interface StatItemProps {
  label: string;
  value: number | string;
  delay?: number;
}

const StatItem = ({ label, value, delay = 0 }: StatItemProps) => {
  const displayValue = typeof value === 'number' ? value.toFixed(4) : value;

  return (
    <div
      className="bg-muted p-2.5 rounded-xl border border-border hover:bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03] animate-zoom-in group cursor-default relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="block text-[11px] font-medium text-muted-foreground mb-0.5 tracking-wide relative z-10 group-hover:text-primary transition-colors duration-300">
        {label}
      </span>
      <span className="text-sm font-bold text-foreground relative z-10">{displayValue}</span>
    </div>
  );
};

export default StatItem;
