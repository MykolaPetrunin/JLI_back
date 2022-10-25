import cors from 'cors'
import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'

const app = express()

const checkJwt = auth({
    audience: 'JustLearnIt',
    issuerBaseURL: 'https://dev-s4myy52mufp2xaj2.eu.auth0.com/',
    secret: 'kDyXp8nIneKufY4DcwUenrsTjWheu1px',
    tokenSigningAlg: 'HS256',
})

app.use(
    cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
    })
)

app.use(checkJwt)

app.get('/api/private', function (req, res) {
    console.log(req.auth)
    res.json({
        message:
            'Hello from a private endpoint! You need to be authenticated to see this.',
    })
})

app.use((req, res) => {
    res.status(404).send({ message: '505' })
})

app.listen(3050)
