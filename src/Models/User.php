<?php namespace Jiko\Hue\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model {
  public $table = 'app_hue_users';
  public $guarded = ['id'];

  public function validateGoogleTokenId($token) {
    // https://developers.google.com/identity/sign-in/web/backend-auth#send-the-id-token-to-your-server
    // https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=XYZ123
    /**
     * @response
     * {
    // These six fields are included in all Google ID Tokens.
    "iss": "https://accounts.google.com",
    "sub": "110169484474386276334",
    "azp": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
    "aud": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
    "iat": "1433978353",
    "exp": "1433981953",

    // These seven fields are only included when the user has granted the "profile" and
    // "email" OAuth scopes to the application.
    "email": "testuser@gmail.com",
    "email_verified": "true",
    "name" : "Test User",
    "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
    "given_name": "Test",
    "family_name": "User",
    "locale": "en"
    }
     */
  }
}