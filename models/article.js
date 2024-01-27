/* import { createRequire } from 'node:module'; */
import { createClient } from "@libsql/client";

/* Creamos un require para importar el json y trabajar con él */
/*
const require = createRequire(import.meta.url)
const articles = require('../articles.json')
*/
import { randomUUID } from 'node:crypto'

export class ArticleModel {

  static async createConnection () {

    const client = createClient({
      url: process.env.DB_URL,
      authToken: process.env.DB_TOKEN,
    });

    return client;
  }

  static async getAll () {
    const client = await this.createConnection();

    const articles = await client.execute("SELECT * FROM articles");

    client.close()

    return articles.rows
  }

  static async getById (id) {
    const client = await this.createConnection();

    const article = await client.execute({
      sql: "SELECT * FROM articles WHERE id = ?",
      args: [id],
    })

    client.close()

    return article.rows
  }

  static async getByCategory (category) {

    const client = await this.createConnection();

    const selectedArticles = await client.execute({
      sql: "SELECT * FROM articles AS A, categories AS C WHERE C.name = ? AND A.category_id = C.id",
      args: [category]
    })

    client.close()

    return selectedArticles.rows
  }

  static async create (input) {
    const newArticle = {
      id: randomUUID(),
      release_date: new Date("yyyy, mm, dd"),
      ...input,
      category_id: `${input.category_id}`,
      brand_id: `${input.brand_id}`,
    }
    console.log(newArticle)
    const client = await this.createConnection();

    await client.execute({
      sql: "INSERT INTO articles (id, name, price, category_id, description, brand_id, availability) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        newArticle.id,
        newArticle.name,
        newArticle.price,
        newArticle.category_id,
        newArticle.description,
        newArticle.brand_id,
        newArticle.availability
      ]
    })

    client.close()

    return;
  }

  static async update (id, input) {
    const client = await this.createConnection();

    const articleToUpdate = (await client.execute({
      sql: "SELECT * FROM articles WHERE id = ?",
      args: [id],
    })).rows[0]


    if (!articleToUpdate) {
      return false
    }

    const updatedArticle = {
      ...articleToUpdate,
      ...input
    }

    await client.execute({
      sql: "UPDATE articles SET name = ?, price = ?, category_id = ?, description = ?, brand_id = ?, availability = ? WHERE id = ?",
      args: [
        updatedArticle.name,
        updatedArticle.price,
        updatedArticle.category_id,
        updatedArticle.description,
        updatedArticle.brand_id,
        updatedArticle.availability,
        id
      ]
    })

    return;
  }

  static async delete (id) {
    const articleIndex = articles.findIndex(article => article.id === id)

    if (articleIndex < 0) {
      return false
    }

    articles.splice(articleIndex, 1)
    return true
  }
}