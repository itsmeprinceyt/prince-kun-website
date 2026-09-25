export function getProduction(): boolean {
  try {
    const productionStatus = process.env.PRODUCTION;
    if (productionStatus === undefined) {
      throw new Error("PRODUCTION environment variable is not set.");
    }
    return productionStatus.toLowerCase() === "true";
  } catch (error) {
    console.error("Failed to determine production status,", error);
    process.exit(1);
  }
}
