// check-memory.js
console.log('Memory usage:');
console.log('RSS:', process.memoryUsage().rss / 1024 / 1024, 'MB');
console.log('Heap Total:', process.memoryUsage().heapTotal / 1024 / 1024, 'MB');
console.log('Heap Used:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
console.log('External:', process.memoryUsage().external / 1024 / 1024, 'MB');