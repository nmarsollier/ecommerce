package events.schema;

public class ArticleValidationEvent {
    private String articleId;
    private boolean valid;
    private int stock;
    private double price;

    public ArticleValidationEvent() {
    }

    public ArticleValidationEvent(String articleId, boolean valid, int stock, double price) {
        this.articleId = articleId;
        this.valid = valid;
        this.stock = stock;
        this.price = price;
    }

    public String getArticleId() {
        return articleId;
    }

    public boolean isValid() {
        return valid;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }
}