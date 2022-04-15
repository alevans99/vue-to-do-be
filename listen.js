const app = require('./app')

//Set port to 9090 if not set in the .env
const {
    PORT = 9090
} = process.env

const listenCallback = () => {
    console.log(`Listening on port: ${PORT}`)
}
app.listen(PORT, listenCallback)