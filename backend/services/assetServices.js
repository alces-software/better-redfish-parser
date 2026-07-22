function extractData(json) {
   let data;

   try {
      data = JSON.parse(json);
   } catch (e) {
      data = {};
   }

   let toAdd = {
      fans: [],
      ethernetInterfaces: []
   };

   if (data.rawRedfish) {
      if (data.fans) {
         fans = data.fans.map((fan) => {
            return {
               name: fan['name'] || 'Not found',
               health: fan['health'] || 'Not found',
               speed: fan['speed'] || 'Not found',
               units: fan['units'] || 'Not found',
               state: fan['state'] || 'Not found',
               hotPluggable: fan['hotPluggable'] || 'Not found'
            };
         });

         toAdd.fans = fans || [];
      }

      if (data.ethernetInterfaces) {
         const ethernetInterfaces = data.ethernetInterfaces.map((interface) => {
            return {
               id: interface['id'] || 'Not found',
               description: interface['description'] || 'Not found',
               macAddress: interface['macAddress'] || 'Not found',
               permanentMacAddress: interface['permanentMacaddress'] || 'Not found',
               speedMbps: interface['speedMbps'] || 'Not found',
               state: interface['state'] || 'Not found',
               health: interface['health'] || 'Not found',
               linkStatus: interface['linkStatus'] || 'Not found',
               enabled: interface['enabled'] || 'Not found'
            };
         });
         toAdd.ethernetInterfaces = ethernetInterfaces || [];
      }

      data = data.rawRedfish.system;
   }

   const processorSummary = data['ProcessorSummary'] || {};
   const memorySummary = data['MemorySummary'] || {};

   const memory = memorySummary['TotalSystemMemoryGiB']
      ? `${memorySummary['TotalSystemMemoryGiB']}GiB`
      : 'Not Found';

   return {
      cores: processorSummary['CoreCount'] || 'Not found',
      processor_name: processorSummary['Model'] || 'Not found',
      processor_count: processorSummary['Count'] || 'Not found',
      memory: memory,
      model: data['Model'] || 'Not found',
      serial_number: data['SerialNumber'] || 'Not found',
      manufacturer: data['Manufacturer'] || 'Not found',
      led: data['IndicatorLED'] || 'Not found',
      description: data['Description'] || 'Not found',
      ...toAdd
   };
}

module.exports = {
   extractData
};
