function extractData(json) {
   let data;

   try {
      data = JSON.parse(json);
   } catch (e) {
      e;
      data = {};
   }

   let toAdd = {
      fans: [],
      ethernetInterfaces: []
   };

   if (data.rawRedfish) {
      if (data.fans) {
         const fans = data.fans.map((fan) => {
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
         const ethernetInterfaces = data.ethernetInterfaces.map((iface) => {
            return {
               id: iface['id'] || 'Not found',
               description: iface['description'] || 'Not found',
               macAddress: iface['macAddress'] || 'Not found',
               permanentMacAddress: iface['permanentMacAddress'] || 'Not found',
               speedMbps: iface['speedMbps'] || 'Not found',
               state: iface['state'] || 'Not found',
               health: iface['health'] || 'Not found',
               linkStatus: iface['linkStatus'] || 'Not found',
               enabled: iface['enabled'] || 'Not found'
            };
         });
         toAdd.ethernetInterfaces = ethernetInterfaces || [];
      }

      if (data.bootOptions) {
         const bootOptions = data.bootOptions.map((option) => {
            return {
               position: option['position'] || 'Not found',
               id: option['id'] || 'Not found',
               displayName: option['displayName'] || 'Not found',
               enabled: option['enabled'] || 'Not found',
               devicePath: option['devicePath'] || 'Not found'
            };
         });
         toAdd.bootOptions = bootOptions || [];
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
