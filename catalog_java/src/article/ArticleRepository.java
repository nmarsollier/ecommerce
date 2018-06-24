package article;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;

import spark.utils.StringUtils;
import utils.db.MongoStore;
import utils.errors.ValidationError;

public class ArticleRepository {
    private static ArticleRepository instance;

    private ArticleRepository() {

    }

    public static ArticleRepository getInstance() {
        if (instance == null) {
            instance = new ArticleRepository();
        }
        return instance;
    }

    public Article save(Article article) {
        MongoStore.getDataStore().save(article);
        return article;
    }

    public Article get(String id) throws ValidationError {
        if (StringUtils.isBlank(id)) {
            throw new ValidationError().addPath("id", "Not found");
        }

        Article result = MongoStore.getDataStore().get(Article.class, new ObjectId(id));
        if (result == null) {
            throw new ValidationError().addPath("id", "Not found");
        }

        return result;
    }

    public List<Article> findByCriteria(String criteria) {
        ArrayList<Article> result = new ArrayList<>();
        Query<Article> q = MongoStore.getDataStore().createQuery(Article.class);
        q.and(q.criteria("enabled").equal(true), //
                q.or(q.criteria("description.name").contains(criteria),
                        q.criteria("description.description").contains(criteria)));

        Iterable<Article> resultList = q.fetch();
        for (Article article : resultList) {
            result.add(article);
        }
        return result;
    }
}