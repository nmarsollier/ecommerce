package com.catalog.articles;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.catalog.errors.InvalidBodyException;
import com.catalog.errors.MultipleArgumentsException;
import com.catalog.utils.Mongo;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;

public class ArticleService {
    static ArticleService instance;

    public Article addArticle(Article article) throws InvalidBodyException, MultipleArgumentsException {
        if (article.id != null) {
            throw new InvalidBodyException("Object already exist");
        }

        return addOrUpdateArticle(article);
    }

    public Article updateArticle(String id, Article article) throws MultipleArgumentsException {
        article.id = new ObjectId(id);
        return addOrUpdateArticle(article);
    }

    public Article getArticle(String id) {
        return Mongo.getInstance().getDatastore().get(Article.class, new ObjectId(id));
    }

    private Article addOrUpdateArticle(Article data) throws MultipleArgumentsException {
        Article article;
        boolean isNew = data.id == null || StringUtils.isEmpty(data.id.toString());
        if (isNew) {
            article = Article.newInstance();
        } else {
            article = getArticle(data.id.toString());
        }

        if (!StringUtils.isEmpty(data.name)) {
            article.name = data.name;
        }

        if (!StringUtils.isEmpty(data.description)) {
            article.description = data.description;
        }

        if (!StringUtils.isEmpty(data.image)) {
            article.image = data.image;
        }

        if (data.price != null) {
            article.price = data.price;
        }

        if (data.stock != null) {
            article.stock = data.stock;
        }

        article.validate();
        Mongo.getInstance().getDatastore().save(article);
        return article;
    }

    public void delArticle(String id) {
        Article article = getArticle(id);
        article.valid = false;
        article.updated = new Date();

        Mongo.getInstance().getDatastore().save(article);
    }

    public List<Article> searchArticles(String searchText) {
        Query<Article> q = Mongo.getInstance().getDatastore().createQuery(Article.class);

        q.and(q.criteria("valid").equal(true),
                q.or(q.criteria("name").contains(searchText), q.criteria("description").contains(searchText)));

        List<Article> result = new ArrayList<>();
        Iterable<Article> articles = q.fetch();
        for (Article article : articles) {
            result.add(article);
        }

        return result;
    }
}
