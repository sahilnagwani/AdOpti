export interface DateRange {
  from: Date;
  to: Date;
}

export const getDefaultDateRange = (): DateRange => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from, to };
};

export const getPriorPeriod = (dateRange: DateRange): DateRange => {
  const days = Math.round(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
  );
  const to = new Date(dateRange.from);
  to.setDate(to.getDate() - 1);
  const from = new Date(to);
  from.setDate(from.getDate() - days);
  return { from, to };
};
