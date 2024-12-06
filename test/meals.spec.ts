import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Meals route', async () => {
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

  it('should be able to create a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })
    expect(createUserResponse.status).toEqual(201)

    const cookies = createUserResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies are undefined')
    }

    const response = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description 1',
        isOnDiet: true,
        date: '2024-12-04',
      })

    expect(response.status).toEqual(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })
    expect(createUserResponse.status).toEqual(201)

    const cookies = createUserResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies are undefined')
    }

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 1',
      description: 'Description 1',
      isOnDiet: true,
      date: '2024-12-04',
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 2',
      description: 'Description 2',
      isOnDiet: false,
      date: '2024-12-04',
    })

    const response = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(response.status).toEqual(200)
    expect(response.body.meals).toHaveLength(2)
  })

  it('should be able to get a specific meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })
    expect(createUserResponse.status).toEqual(201)

    const cookies = createUserResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies are undefined')
    }

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description 1',
        isOnDiet: true,
        date: '2024-12-04',
      })
    expect(mealResponse.status).toEqual(201)

    const meals = await request(app.server).get('/meals').set('Cookie', cookies)
    const mealId = meals.body.meals[0].id

    const response = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(response.status).toEqual(200)
    expect(response.body.meal).toEqual(
      expect.objectContaining({
        name: 'Meal 1',
        description: 'Description 1',
        is_on_diet: 1,
      }),
    )
  })

  it('should be able to update a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })
    expect(createUserResponse.status).toEqual(201)

    const cookies = createUserResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies are undefined')
    }

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description 1',
        isOnDiet: true,
        date: '2024-12-04',
      })
    expect(mealResponse.status).toEqual(201)

    const meals = await request(app.server).get('/meals').set('Cookie', cookies)
    const mealId = meals.body.meals[0].id

    const updateResponse = await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Updated Meal',
        description: 'Updated Description',
        isOnDiet: false,
        date: '2023-08-02',
      })

    expect(updateResponse.status).toEqual(204)

    const updatedMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(updatedMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Updated Meal',
        description: 'Updated Description',
        is_on_diet: 0,
      }),
    )
  })

  it('should be able to delete a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })
    expect(createUserResponse.status).toEqual(201)

    const cookies = createUserResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies are undefined')
    }

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal 1',
        description: 'Description 1',
        isOnDiet: true,
        date: '2024-12-04',
      })
    expect(mealResponse.status).toEqual(201)

    const meals = await request(app.server).get('/meals').set('Cookie', cookies)
    const mealId = meals.body.meals[0].id

    const deleteResponse = await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(deleteResponse.status).toEqual(204)

    const mealsAfterDeletion = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(mealsAfterDeletion.body.meals).toHaveLength(0)
  })

  it('should calculate meal metrics', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
    })
    expect(createUserResponse.status).toEqual(201)

    const cookies = createUserResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Cookies are undefined')
    }

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 1',
      description: 'Description 1',
      isOnDiet: true,
      date: '2024-12-04',
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 2',
      description: 'Description 2',
      isOnDiet: true,
      date: '2024-12-05',
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Meal 3',
      description: 'Description 3',
      isOnDiet: false,
      date: '2023-08-06',
    })

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)

    expect(metricsResponse.status).toEqual(200)
    expect(metricsResponse.body).toEqual(
      expect.objectContaining({
        totalMeals: 3,
        totalMealsOnDiet: 2,
        totalMealsOffDiet: 1,
        bestSequenceOnDiet: 2,
      }),
    )
  })
})
