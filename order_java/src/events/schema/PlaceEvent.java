package events.schema;

public class PlaceEvent {
    private String cartId;
    private String userId;
    private Article[] articles;

    public PlaceEvent() {
    }

    public PlaceEvent(String cartId, String userId, Article[] articles) {
        this.cartId = cartId;
        this.userId = userId;
        this.articles = articles;
    }

    public String getCartId() {
        return cartId;
    }

    public String getUserId() {
        return userId;
    }

    public Article[] getArticles() {
        return articles;
    }

    public static class Article {
        private String articleId;
        private int quantity;

        public Article() {
        }

        public Article(String articleId, int quantity) {
            this.articleId = articleId;
            this.quantity = quantity;
        }

        public String getArticleId() {
            return articleId;
        }

        public int getQuantity() {
            return quantity;
        }
    }
}
