function extractData(json) {
   let data;

   try {
      data = JSON.parse(json);
   } catch (e) {
      data = {};
   }

   let toAdd = {
      fans: []
   };

   if (data.rawRedfish) {
      if (data.fans){
         fans = data.fans.map(fan => {
            return {
               name: fan['name'] || 'Not found',
               health: fan['health'] || 'Not found',
               speed: fan['speed'] || 'Not found',
               units: fan['units'] || 'Not found',
               state: fan['state'] || 'Not found',
               hotPluggable: fan['hotPluggable'] || 'Not found'
            };
         });

         console.log('Fans:', fans);
      }

      toAdd.fans = fans || [];


      data = data.rawRedfish.system
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