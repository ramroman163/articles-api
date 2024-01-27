import { createClient } from "@libsql/client";
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

  static async getAllProcessed () {
    const client = await this.createConnection();

    const articles = await client.execute(`
    SELECT 
    A.id,
    A.name, 
    C.name AS category, 
    B.name AS brand, 
    A.price,
    A.description,
    CASE
        WHEN A.availability = 1
        THEN "Disponible"
        ELSE "No disponible"
    END AS availability,
    A.release_date
    FROM Articles AS A
    INNER JOIN categories AS C ON A.category_id = C.id
    INNER JOIN brands AS B ON A.brand_id = B.id;`);

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

    if (article.rows.length > 1) {
      return article.rows
    } else if (article.rows.length === 1) {
      return article.rows[0]
    } else {
      return false;
    }
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
    const todayDate = new Date().toJSON().slice(0, 10);

    const newArticle = {
      id: randomUUID(),
      release_date: todayDate,
      ...input,
      category_id: `${input.category_id}`,
      brand_id: `${input.brand_id}`,
    }

    const client = await this.createConnection();

    await client.execute({
      sql: "INSERT INTO articles (id, name, price, category_id, description, brand_id, availability, release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        newArticle.id,
        newArticle.name,
        newArticle.price,
        newArticle.category_id,
        newArticle.description,
        newArticle.brand_id,
        newArticle.availability,
        newArticle.release_date
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
    const client = await this.createConnection();

    const deleteResponse = await client.execute({
      sql: "DELETE FROM articles WHERE id = ?",
      args: [id],
    })

    if (!deleteResponse.rowsAffected) {
      return false
    } else {
      return true
    }
  }
}