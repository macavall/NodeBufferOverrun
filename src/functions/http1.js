const { app } = require('@azure/functions');

app.http('http1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: (request, context) => {  // Synchronous version
        context.log(`Http function processed request for url "${request.url}"`);
        
        const name = request.query.get('name') || request.text(); // Synchronous
        
        // Dangerous recursive function that will overflow stack
        function greetRecurse(n, greeting) {
            context.log(`Count: ${n}`);
            return greetRecurse(n + 1, `Hello, ${greeting}!`); // Infinite recursion
        }
        
        const result = greetRecurse(1, name);
        return { body: result };
    }
});