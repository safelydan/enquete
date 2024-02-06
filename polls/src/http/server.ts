import fastify from "fastify";

const app = fastify();


const port = 3333;

app.get('/hello', (req, res)=>{
    return 'hello';
})

app.listen({port}).then(()=>{
    console.log('http server running');
})

// Driver Nativo
// ORMs