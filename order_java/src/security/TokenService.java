package security;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import spark.utils.StringUtils;
import utils.errors.SimpleError;
import utils.server.Environment;

/**
 * @apiDefine AuthHeader
 *
 * @apiExample {String} Header Autorización
 *     Authorization=bearer {token}
 *
 * @apiErrorExample 401 Unauthorized
 *     HTTP/1.1 401 Unauthorized
 */
public class TokenService {
    static ExpiringMap<String, User> map = new ExpiringMap<>(60 * 60, 60 * 5);

    private TokenService() {
    }

    public static void validateAdmin(String token) throws SimpleError {
        validate(token);
        User cachedUser = map.get(token);
        if (cachedUser == null) {
            throw new SimpleError(401, "Unauthorized");
        }
        if (!contains(cachedUser.permissions, "admin")) {
            throw new SimpleError(401, "Unauthorized");
        }
    }

    public static void validate(String token) throws SimpleError {
        if (StringUtils.isBlank(token)) {
            throw new SimpleError(401, "Unauthorized");
        }

        User cachedUser = map.get(token);
        if (cachedUser != null) {
            return;
        }

        User user = retrieveUser(token);
        if (user == null) {
            throw new SimpleError(401, "Unauthorized");
        }
        map.put(token, user);
    }

    // Devuelve un usuario logueado
    public static User getUser(String token) throws SimpleError {
        if (StringUtils.isBlank(token)) {
            throw new SimpleError(401, "Unauthorized");
        }

        User cachedUser = map.get(token);
        if (cachedUser != null) {
            return cachedUser;
        }

        User user = retrieveUser(token);
        if (user == null) {
            throw new SimpleError(401, "Unauthorized");
        }
        map.put(token, user);
        return user;
    }

    public static void invalidate(String token) {
        map.remove(token);
    }

    private static User retrieveUser(String token) {
        HttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet(Environment.getEnv().securityServerUrl + "/v1/users/current");
        request.addHeader("Authorization", token);
        HttpResponse response;
        try {
            response = client.execute(request);

            if (response.getStatusLine().getStatusCode() != 200) {
                return null;
            }

            HttpEntity responseEntity = response.getEntity();
            if (responseEntity == null) {
                return null;
            }
            String body = EntityUtils.toString(responseEntity);
            return User.fromJson(body);
        } catch (Exception e) {
            return null;
        }
    }

    private static boolean contains(String[] permissions, String permission) {
        for (String s : permissions) {
            if (s.equals(permission)) {
                return true;
            }
        }
        return false;
    }
}
