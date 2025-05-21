module.exports = {
    apps: [
      {
        name: 'nuxt-frontend',
        cwd: './website',
        script: 'node',
        args: '.output/server/index.mjs',
        env: {
          PORT: 3000,
          NODE_ENV: 'production',
          NUXT_PUBLIC_STRAPI_URL: 'http://api.localhost'
        },
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G'
      },
      {
        name: 'strapi-backend',
        cwd: './strapi-backend',
        script: 'npm',
        args: 'start',
        env: {
          NODE_ENV: 'production',
          PORT: 1337,
          DATABASE_CLIENT: 'postgres',
          DATABASE_HOST: 'localhost',
          DATABASE_PORT: 5432,
          DATABASE_NAME: 'strapi',
          DATABASE_USERNAME: 'strapi',
          DATABASE_PASSWORD: 'strapi'
        },
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G'
      }
    ]
  };