const debug = (service: string, ...logItems: any) => {
  console.log(`${service.toUpperCase()} |`, ...logItems);
};

const error = (...logItems: any) => {
  console.error("ERROR |", ...logItems);
};

export { debug, error };