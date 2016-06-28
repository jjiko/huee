<?php

namespace Jiko\Hue;

use Illuminate\Support\ServiceProvider;

class HueServiceProvider extends ServiceProvider
{
  public function boot(Router $router)
  {
    parent::boot($router);

    $this->loadViewsFrom(__DIR__ . '/../Hue/src/resources/views', 'hue');
  }

  public function register()
  {
    parent::register();
  }

  public function map(Router $router)
  {
    if (in_array(Input::server('HTTP_HOST'), ['app.joejiko.com'])) {
      $router->get('manifest.json', 'Jiko\Hue\Http\Controllers\HueController@manifest');
      $router->get('service-worker.js', 'Jiko\Hue\Http\Controllers\HueController@service');
      $router->get('notifications', 'Jiko\Hue\Http\Controllers\HueController@notifications');
      $router->get('notifications/get', function () {
        return response()->json(['status' => 200]);
      });
    }

    if (in_array(Input::server('HTTP_HOST'), ['huee.joejiko.com', 'local-huee.joejiko.com', 'local.joejiko.com', 'localhost'])) {
      if (in_array(Input::server('HTTP_HOST'), ['local.joejiko.com', 'localhost'])) {
        $router->group(['prefix' => 'hue'], function () {
          require_once(__DIR__ . '/../hue/src/Http/routes.php');
        });
      } else {
        require_once(__DIR__ . '/../hue/src/Http/routes.php');
      }
    }
  }
}