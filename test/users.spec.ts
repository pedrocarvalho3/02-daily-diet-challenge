import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { knex } from '../src/database'

describe('Users route', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })

    expect(response.status).toEqual(201)
  })

  it('should not allow creating a user with the same email', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })

    const response = await request(app.server).post('/users').send({
      name: 'Jane Doe',
      email: 'jhondoe@example.com',
    })

    expect(response.status).toEqual(409)
    expect(response.body.error).toEqual('User already exists')
  })

  it('should create a sessionId cookie if it does not exist', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = response.headers['set-cookie']
    expect(cookies).toBeDefined()
    expect(cookies[0]).toMatch(/sessionId=/)
  })

  it('should save the user in the database', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    const user = await knex('users')
      .where({ email: 'johndoe@example.com' })
      .first()

    expect(user).toBeDefined()
    expect(user?.name).toBe('John Doe')
    expect(user?.email).toBe('johndoe@example.com')
  })
})
