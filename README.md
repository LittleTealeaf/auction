# Auction Website


## Initial Setup

### 1. Install required programs

Programs required:
 - `npm`

### 2. Install npm modules
This will create a `node_modules` directory that will contain all the required resources for the website
```bash
npm i
```

### 3. Set up Prisma
First, you need to create the new prisma database
```bash
npm run prisma
```
Now that the prisma database is initialize, it's suggested to seed the database with the default values:
```bash
npm run seed
```
This will add the role `admin`, which can manage everything. Additionally, it will create the user `admin` with a blank password. Accounts with blank passwords will accept any password, and set it's new password to that password.

If you forget the password, you can use the following command to run and open up a database explorer. The username/password values are stored in the 'users' model
```bash
npm run database
```
