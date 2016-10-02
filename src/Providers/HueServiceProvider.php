<?php

namespace Jiko\Hue\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Input;

class HueServiceProvider extends ServiceProvider
{
  protected $hostArray = ['local-huee.joejiko.com'];

  public function boot()
  {
    parent::boot();

    //if (in_array(Input::server('HTTP_HOST'), $this->hostArray)) {
      $this->loadViewsFrom(__DIR__ . '/../resources/views', 'hue');
    //}
  }

  public function register()
  {

  }

  public function map()
  {
    #if (!$this->app->routesAreCached()) {
      require_once __DIR__ . '/../Http/routes.php';
    #}
  }
}