function extractData(json) {
  let data;

  try {
    data = JSON.parse(json);
  } catch (e) {
    data = {};
  }

  const processorSummary = data["ProcessorSummary"] || {};
  const memorySummary = data["MemorySummary"] || {};

  const memory = memorySummary["TotalSystemMemoryGiB"]
    ? `${memorySummary["TotalSystemMemoryGiB"]}GiB`
    : "Not Found";

  return {
    cores: processorSummary["CoreCount"] || "Not found",
    processor_name: processorSummary["Model"] || "Not found",
    processor_count: processorSummary["Count"] || "Not found",
    memory: memory,
    model: data["Model"] || "Not found",
    serial_number: data["SerialNumber"] || "Not found",
    manufacturer: data["Manufacturer"] || "Not found",
    led: data["IndicatorLED"] || "Not found",
    description: data["Description"] || "Not found",
  };
}

module.exports = {
   extractData
};