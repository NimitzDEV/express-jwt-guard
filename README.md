# express-jwt-guard

This middleware is use for control JWT authorization checking in a more central way.

This middleware can be run on Connect/Express framework.

## Installation

`npm install express-jwt-guard` or `yarn install express-jwt-guard`

## Basic Usage

```javascript
const express = require('express');
const app = express();
const config = require('./config');
const guard = require('../index')({'/': {permissions: ['ADMIN']}}, 'secret', {}, {});

app.use(guard.guard);
app.get('/', (req, res, next) => {
   // if the JWT header contains valid token that has ADMIN permission
   // request can be proceed otherwise will get 401
   res.send('success');
});
```

## Configuring router map

When initializing the JWTGuard class, you should pass 4 parameters.

The first one is the router map, it indicates which request and which method should be validated.

For instance: Add a user should only can be done by admin account.

```javascript
module.exports = {
    '/user': {
	    methods: ['POST'],
        permissions: ['ADMIN']
    }
}
```

When POST /user, the JWTGuard will check `permissions` in JWT data to see if current user is qualified to do this, if not, it will return 401. Or the current user only has a STUDENT permission, it will return 403.

If the `methods` is not presented, all the methods will be checked.

For the route like `/user/:id`, you can also write `/user/:id` in the router map. But you should explicitly place a JWTGuard middleware inside that route, because we don't know the current matched pattern in the app level, we can only know it when it actually matched.

```javascript
app.get('/user/:id', guard.guard, (req, res, next) => res.send('success'))
```

## JWT Options

For the second parameter, you should provide a JWT secret, and the third parameter is the JWT options, learn more on jsonwebtoken

## JWTGuard Options

It supports a `header` options, tells the JWTGuard from which header field to retrieve the JWT token, defaults  to `JWT`