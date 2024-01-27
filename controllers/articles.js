import { ArticleModel } from '../models/article.js'
import { validateArticle, validatePartialArticle } from '../schemas/articles.js'

export class articleController {
  static async getAll (req, res) {
    const articles = await ArticleModel.getAll();

    return res.json(articles);
  }

  static async getByCategory (req, res) {
    const { category } = req.params

    const filteredArticles = await ArticleModel.getByCategory(category)

    if (!filteredArticles) {
      res.status(404).json({ message: "Cero articles found" })
    } else {
      res.json(filteredArticles)
    }
  }

  static async getById (req, res) {
    const { id } = req.params

    const article = await ArticleModel.getById(id)

    if (article) {
      return res.json(article)
    } else {
      return res.status(404).json({ message: 'Article Not Found' })
    }
  }

  static async create (req, res) {
    const result = validateArticle(req.body)
    console.log(result)
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    await ArticleModel.create(result.data)

    res.status(201).json({ message: "New article created" })
  }

  static async update (req, res) {
    const { id } = req.params
    const result = validatePartialArticle(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.message })
    }

    const updatedArticle = await ArticleModel.update(id, result.data)

    res.status(200).json(updatedArticle)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await ArticleModel.delete(id)

    if (!result) return res.status(404).json({ message: 'Article not found' })

    return res.json({ message: 'Article deleted' })
  }
}