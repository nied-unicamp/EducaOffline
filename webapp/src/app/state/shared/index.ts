
export const nowString = () => toDateString(new Date());
export const toDateString = (date: Date) => date.toISOString();

export const matchPartial = <T>(all: T[], partial: Partial<T>) => all.filter(item =>
  Object.keys(partial)
    .filter(key => partial[key] !== null && partial[key] !== undefined)
    .every(key => partial[key] === item[key])
);
