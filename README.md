# Gravestellene Backend Rest API

### Run the project

```
yarn install
```

```
yarn start
```

### Run Prettier

```
yarn run prettier
```

### Generate hex code for JWT

```
  import crypto from 'crypto';

  const secretKey = crypto.randomBytes(64).toString("hex");
  console.log(secretKey);
```
