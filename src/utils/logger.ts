const debug = (service: string, ...logItems: any) => {
  console.log(`${service} |`, ...logItems);
};

const error = (...logItems: any) => {
  console.error("ERROR |", ...logItems);
};

export { debug, error };