import cors from 'cors'
import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import mongoose from 'mongoose';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
    })
);


app.use(auth({
    audience: 'JustLearnIt',
    issuerBaseURL: 'https://dev-s4myy52mufp2xaj2.eu.auth0.com/',
    secret: 'kDyXp8nIneKufY4DcwUenrsTjWheu1px',
    tokenSigningAlg: 'HS256',
}));

app.get('/api/private',  (req, res) => {
    console.log(req.auth?.payload.email);

    res.json({
        message:
            'Hello from a private endpoint! You need to be authenticated to see this.',
    })
})

app.use((req, res) => {
    res.status(404).send({ message: '404' })
})

mongoose.connect('mongodb+srv://admin:ScVb1984@cluster0.67qegpj.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    app.listen(3050);
}).catch( (err) => console.log(err));

