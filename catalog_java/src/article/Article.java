package article;

import java.util.Date;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import article.vo.ArticleData;
import article.vo.DescriptionData;
import article.vo.NewData;
import utils.errors.ValidationError;
import utils.validator.Validator;

/**
 * Es el Agregado principal de Articulo.
 */
@Entity("articles")
public class Article {
    @Id
    private ObjectId id;

    private Description description;

    private double price;
    private int stock;

    @SuppressWarnings("unused")
    private Date updated = new Date();

    @SuppressWarnings("unused")
    private Date created = new Date();

    private boolean enabled = true;

    private Article() {

    }

    /**
     * Crea un nuevo articulo
     */
    public static Article newArticle(NewData data) throws ValidationError {
        Validator.validate(data);

        Article article = new Article();

        article.description = new Description();
        article.description.name = data.name;
        article.description.description = data.description;
        article.description.image = data.image;
        article.price = data.price;
        article.stock = data.stock;

        return article;
    }

    /**
     * Actualiza la descripción de un articulo.
     */
    public void updateDescription(DescriptionData data) throws ValidationError {
        Validator.validate(data);

        this.description.name = data.name;
        this.description.description = data.description;
        this.description.image = data.image;
        this.updated = new java.util.Date();
    }

    /**
     * Actualiza el precio de un articulo.
     */
    public void updatePrice(double price) throws ValidationError {
        if (price < 0) {
            throw new ValidationError().addPath("price", "Inválido");
        }

        this.price = price;
        this.updated = new java.util.Date();
    }

    /**
     * Actualiza el stock actual de un articulo.
     */
    public void updateStock(int stock) throws ValidationError {
        if (stock < 0) {
            throw new ValidationError().addPath("stock", "Inválido");
        }

        this.stock = stock;
        this.updated = new java.util.Date();
    }

    /**
     * Deshabilita el articulo para que no se pueda usar mas
     */
    public void disable() {
        this.enabled = false;
        this.updated = new java.util.Date();
    }

    public boolean enabled() {
        return enabled;
    }

    /**
     * Obtiene una representación interna de los valores.
     * Preserva la inmutabilidad de la entidad.
     */
    public ArticleData value() {
        ArticleData data = new ArticleData();
        data.id = this.id.toHexString();

        data.name = this.description.name;
        data.description = this.description.description;
        data.image = this.description.image;

        data.price = this.price;
        data.stock = this.stock;

        data.enabled = this.enabled;
        return data;
    }

    static class Description {
        String name;
        String description;
        String image;
    }
}
