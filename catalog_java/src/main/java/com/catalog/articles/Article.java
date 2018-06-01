package com.catalog.articles;

import java.util.Date;

import com.catalog.errors.InvalidArgumentException;
import com.catalog.errors.MultipleArgumentsException;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

@Entity("articles")
class Article {
    @Id
    public ObjectId id;

    public String name;
    public String description;
    public Double price;
    public Integer stock;
    public String image;
    public Date updated;
    public Date created;
    public Boolean valid;

    public void validate() throws MultipleArgumentsException {
        MultipleArgumentsException error = new MultipleArgumentsException();

        if(StringUtils.isEmpty(name)) {
            error.addError(new InvalidArgumentException("name", "Invalid value"));
        } else if (name.length() > 100) {
            error.addError(new InvalidArgumentException("name", "Invalid length"));
        }

        if (description == null || description.length() > 2048) {
            error.addError(new InvalidArgumentException("description", "Invalid length"));
        }

        if (image == null || image.length() > 100) {
            error.addError(new InvalidArgumentException("image", "Invalid length"));
        }

        if (stock == null || stock < 0) {
            error.addError(new InvalidArgumentException("stock", "Invalid value"));
        }

        if (price == null || price < 0) {
            error.addError(new InvalidArgumentException("price", "Invalid value"));
        }

        if (created == null) {
            error.addError(new InvalidArgumentException("created", "Invalid value"));
        }

        if (updated == null) {
            error.addError(new InvalidArgumentException("updated", "Invalid value"));
        }

        if(!error.getErrors().isEmpty()) {
            throw error;
        }
    }

    public static Article newInstance() {
        Article article = new Article();
        article.name = "";
        article.description = "";
        article.image = "";
        article.price = 0.0;
        article.stock = 0;
        article.created = new Date();
        article.updated = new Date();
        article.valid = true;
        return article;
    }
}
