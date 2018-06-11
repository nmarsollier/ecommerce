package user

import (
	"auth/token"
	"auth/tools/errors"
	"auth/tools/rest"
)

type NewUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
	Login    string `json:"login" binding:"required"`
}

// SignUp is the controller to signup new users
func SignUp(user NewUserRequest) (string, error) {
	newUser := newUser()
	newUser.Login = user.Login
	newUser.Name = user.Name
	newUser.Roles = []string{"user"}
	newUser.setPasswordText(user.Password)

	newUser, err := saveUser(newUser)
	if err != nil {
		if rest.IsUniqueKeyError(err) {
			return "", errors.NewValidationErrorError("login", "Ya existe")
		} else {
			return "", err
		}
	}

	tokenString, err := token.CreateToken(newUser.ID())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// SignIn is the controller to sign in users
func SignIn(login string, password string) (string, error) {
	user, err := findUserByLogin(login)
	if err != nil {
		return "", err
	}

	err = user.validatePassword(password)
	if err != nil {
		return "", err
	}

	tokenString, err := token.CreateToken(user.ID())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// CurrentUser is the controller to get the current logged in user
func CurrentUser(userID string) (*User, error) {
	return findUserByID(userID)
}

// ChangePassword Change Password Controller
func ChangePassword(userID string, current string, newPassword string) error {
	user, err := findUserByID(userID)
	if err != nil {
		return err
	}

	err = user.validatePassword(current)
	if err != nil {
		return err
	}

	err = user.setPasswordText(newPassword)
	if err != nil {
		return err
	}

	_, err = saveUser(*user)
	if err != nil {
		return err
	}

	return nil
}
