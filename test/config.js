module.exports = {
  '/getonly': {
    permissions: ['ADMIN'],
    methods: ['GET'],
  },
  '/allmethods': {
    permissions: ['ADMIN'],
  },
  '/require2perms': {
    permissions: ['ADMIN', 'CFG:W'],
  },
  '/route/user/:id': {
    permissions: ['ADMIN'],
  },
};
