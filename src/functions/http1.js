const { app } = require('@azure/functions');

app.http('http1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        
        try {
            const name = request.query.get('name') || await request.text() || 'world';
            
            // Safe async iteration instead of recursion
            const greetIterate = async (n, greeting, maxCount = 3000) => {
                let count = n;
                let result = greeting;
                
                // Use while loop with async delay to prevent stack growth
                while (count <= maxCount) {
                    context.log(`Count: ${count}`);
                    result = `Hello, ${result}!`;
                    
                    // Yield control to event loop
                    await new Promise(resolve => setImmediate(resolve));
                    count++;
                }
                
                return result;
            };
            
            const result = await greetIterate(1, name);
            return { 
                body: result,
                status: 200
            };
        } catch (error) {
            context.log.error('Error processing request:', error);
            return { 
                body: 'Error processing request',
                status: 500
            };
        }
    }
});