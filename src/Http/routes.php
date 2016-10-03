<?php
Route::group(['domain' => 'huee.joejiko.com', 'namespace' => 'Jiko\Hue\Http\Controllers'], function(){
  // pages
  Route::get('/', 'HueController@index');

  Route::get('manifest.json', 'HueController@manifest');
  Route::get('service-worker.js', 'HueController@service');
  // api
  Route::post('auth', 'HueController@auth');
  Route::any('defer', 'HueController@defer');
  Route::get('deferred', 'HueController@deferred');
  Route::get('detect', 'HueController@detect');
  Route::any('lights', 'HueController@lights');
  Route::post('save', 'HueController@save');
  // notifications
  Route::get('api/push', function(){
    return response()->json(['status' => 200]);
  });
  Route::get('api/logo', function(){
    return response()->json(Input::all());
  });
  Route::get('api/notifications', function(){
    return response()->json(Input::all()); 
  });

  Route::get('{match}', function($match){
    return $match;
  })->where(':match', '.*');
});
