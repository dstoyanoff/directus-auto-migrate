# Directus Migrate

## Motivation

There is no official way today to run migrations in [Directus](https://github.com/directus/directus)
in a way to support automation between environments. The only way to do that is to create migrations using knex manually.
Doing so however has a few drawbacks:

- You have to write all migrations manually, instead of leveraging the Directus UI, which is much easier to use
- Writing manual queries is very time-consuming
- You have to know the Directus internals to understand what records to write in the system tables.
  Any eventual change to those internal tables done by the Directus team is hard to predict
- All manual work is error-prone and can lead to data inconsistency

## Solution

Given the above problem, here is the formula that this package implements to try to solve:

- The first time the script is run, it generates a state file. This state file contains 2 main nodes - data and schema.
  Schema is extracted using [knex-schema-inspector](https://github.com/knex/knex-schema-inspector), while the data is queries
  from the system tables themselves
- Everytime you run the script after that, it gets the same state and creates a comparison between the saved state and the current database's state

## Usage

- Run the script the first time to get your state
- Do some changes in Directus UI
- Run again to create a migration
- Commit the state file in your SCM

```console
npx directus-auto-migrate my-first-migration
```

Optional arguments:

- **envFile** - path to the env file - the environment variables that are used
  are the same that Directus itself is using, trying to ensure a great level of compatibility. Defaults to **.env**
- **stateFile** - path to the file to use as a state file. Defaults to **directus-state.json**
- **migrationsDir** - path to the directory to write migrations in. Defaults to **src/migrations**
- **format** (javascript/typescript) - whether to generate the migration as a JavaScript or a TypeScript file. Defaults to **typescript**

## Disclaimer

The solution is experimental and only tested with Postgres. Please always inspect the generated queries and verify
that they correspond to the real changes being done.

It is recommended that after the migration is generated, you reset your database with that migration
to ensure that the Directus app works as expected.

It is recommended to use Docker for easier database start and restart and to leverage the Directus migrations system
