module.exports = {
    database: {
      name: process.env.DATABASE_NAME,
      db_url: process.env.DATABASE_URL
    },
    emailDetails: {
      service: process.env.SERVICE,
      email: process.env.EMAIL,
      password: process.env.PASSWORD
    },
    jwtKeys: {
      secretKey: process.env.SECRET_KEY
    }
  }
  