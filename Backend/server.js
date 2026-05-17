const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, 'src', '.env') }) // Load environment variables from src/.env

const app = require('./src/app')
const connectToDB = require('./src/config/database')

const PORT = process.env.PORT || 3000

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err)
        process.exit(1)
    })


