<!doctype html>
<html>
<meta charset="utf-8">
<meta name="google-signin-client_id" content="29103454985.apps.googleusercontent.com">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" type="text/css" href="/vendor/google/material-design-icons/material-icons.css">
<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.9/css/bootstrap-material-design.css">
<link rel="stylesheet" href="/vendor/telerik/kendoui/kendo.default.min.css">
<link rel="stylesheet" href="/css/hue.css">
<link rel="icon" type="image/png" href="//cdn.joejiko.com/img/favicons/hue/white_e27_b22x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="//cdn.joejiko.com/img/favicons/hue/white_e27_b22x32.png" sizes="32x32">
<title>Hue</title>
<body>
<iframe id="notifications" src="https://app.joejiko.com/notifications" frameborder="0" width="0" height="0"></iframe>
<div id="app" data-fullscreen-state="Off" data-display="guest" data-state="loading" data-view="{{ $view }}">
    @include('hue::partial.nav')
    <div class="container">
        <div class="row">
            <div class="col-sm-6 col-sm-offset-3">
                <div class="row visible-guest">
                    <div class="col-sm-12">
                        <div class="pull-left"><h1>{{ trans('hello') }}</h1></div>
                        <div class="visible-google-ready pull-right">
                            <button data-event-trigger="google:auth" class="btn btn-lg btn-primary btn-raised">
                                {{ trans('sign in') }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="log" style="font-size:24px; padding: 10px;"></div>
                </div>
                <div style="display:none">
                    <div class="g-signin2" data-onsuccess="onSignIn"></div>
                </div>
            </div>
        </div>
        <div class="row view-lights">
            @include('hue::index')
        </div>
        <div class="row view-groups">
            @include('hue::groups')
        </div>
        <div class="row view-settings">
            @include('hue::settings')
        </div>
        <div id="admin-controls">
            <div class="btn-group">
                <button id="console" data-event-trigger="admin:console_show" class="btn btn-primary visible-admin">
                    Show Console
                </button>
                <button id="logout" class="btn btn-primary visible-admin" data-event-trigger="cache:flush">
                    {{ trans('sign out') }}
                </button>
            </div>
        </div>
    </div>
</div>
<script><?php echo file_get_contents(base_path('Jiko/Hue/src/storage/hue.js')); ?></script>
<script>var app = {}</script>
<script src="/dist/js/app-hue.js" async defer></script>
<script>
    function onSignIn(googleUser) {
        app.events.trigger('user:google_sign_in', [googleUser]);
    }
</script>
</body>
</html>