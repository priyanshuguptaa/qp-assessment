
# Grocery Booking API

The Grocery Booking API facilitates online booking and management of grocery orders, providing endpoints for users to browse products, place orders.




## Installation

1) Clone the repo

```bash
  git clone https://github.com/priyanshuguptaa/qp-assessment.git
```

2) move to qp-assessment

```bash
  cd qp-assessment
```

3) Run docker compose

```bash
  sudo docker-compose up --build
```

4) Wait until the below line on terminal

```bash
  grocery_api | Server started at PORT : 8000
```

5) In other terminal migrate prisma (*Only for the first time*)

```bash
  #Enter the bash of the grocery_api container

  sudo docker exec -it grocery_api /bin/bash

  #Migrate prisma

  npx prisma migrate deploy
```

6) To check whether the table in the db is created or not

```bash
  #Run the below command in the terminal

  psql -h localhost -p 5400 -U postgres -d grocery_db -c "\dt"

```

7) Use postman collection
## Tech Stack


**Server:** Node, Express, Typescript, PostgreSQL, Prisma, Docker 

