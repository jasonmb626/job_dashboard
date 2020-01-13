# Job Dashboard

Keep track of jobs applied for, when to followup, and with whom.

This project allowed the author to practice building a basic (and then slightly beyond basic) full stack CRUD application using the MERN stack, and then debug and refactor during use/testing.

#### Installation

Clone the repository

```bash
git clone https://github.com/jasonmb626/job_dashboard.git
```

Install the dependencies. Make sure you have Node.JS installed first.

```bash
cd job_dashboard
npm i
```

Edit config/default.json with your MongoDB URI connection string and make up your own jwtSecret.

> Replace <user> and <password> appropriately. You can [download](https://www.mongodb.com/download-center/community) MongoDB Server for use locally or host this in the cloud for free (in development) with [MongoDB Atlas](https://www.mongodb.com/download-center/cloud).

```javascript
{
  "mongoURI": "mongodb+srv://<user>:<password>@cluster0-qmira.mongodb.net/jobsgi",
  "jwtSecret": "<secret>"
}
```

Run locally

```bash
npm run dev
```

Register a new user & begin using the service.