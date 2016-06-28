<?php namespace Jiko\Hue\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Session;
use Jiko\Hue\Models\User;

class HueController extends BaseController
{
  public function auth()
  {
    // use input first.. then session OR null
    $google_id = Input::has('google_id')
      ? Input::get('google_id') : (Session::has('google_id')
        ? Session::get('google_id') : null);

    if(!is_numeric($google_id)) {
      return response()->json([
        'error' => 'tried to authenticate without id'
      ]);
    }

    if (!$user = User::where('google_id', $google_id)->first()) {
      // @todo validate token before registering
      $user = new User(['google_id' => $google_id]);
    }

    // update auth credentials
    $user->google_id_token = Input::get('google_id_token');
    $user->google_auth_response = json_encode(Input::get('google_auth_response'));
    $user->email = Input::get('email');
    $user->name = Input::get('name');

    Session::set('google_id', $google_id);

    // commit
    $user->save();

    return response()->json($user);
  }

  public function lights()
  {
    $google_id = Input::has('google_id')
      ? Input::get('google_id') : (Session::has('google_id')
        ? Session::get('google_id') : null);
    if(is_numeric($google_id)) {
      $user = User::where('google_id', $google_id)->first();
    }

    if (!$user) {
      return response()->json([]);
    }

    return response()->json(json_decode($user->lights));
  }

  public function defer()
  {
    if ($user = User::where('google_id', Session::get('google_id'))->first()) {
      if (!json_decode($user->deferred)) {
        $user->deferred = json_encode([]);
      }

      $user->deferred = json_encode(array_merge(json_decode($user->deferred), Input::all()));
      $user->save();
    }

    return response()->json(json_decode($user->defer));
  }

  public function deferred()
  {
    if ($user = User::where('google_id', Session::get('google_id'))->first()) {

      $deferred = json_decode($user->deferred);

      // clear deferred
      $user->update(['deferred' => json_encode([])]);

      return response()->json($deferred);
    }

    return response()->json([]);
  }

  public function index()
  {
    return view('hue::layout')->with(['view' => 'lights']);
  }

  public function groups()
  {
    return view('hue::layout')->with(['view' => 'groups']);
  }

  public function settings()
  {
    return view('hue::layout')->with([
      'view' => 'settings'
    ]);
  }

  public function manifest()
  {
    $manifest = json_decode(file_get_contents(base_path('Jiko/Hue/src/storage/manifest.json')));
    return response()->json($manifest);
  }

  public function notifications()
  {
    return view('hue::notifications');
  }

  public function service()
  {
    $content = file_get_contents(base_path('Jiko/Hue/src/storage/service-worker.js'));
    return response($content)->header('Content-Type', 'application/javascript');
  }


  public function save()
  {
    if (empty(Session::get('google_id'))) {
      return response()->json([
        'error' => "no google_id in user session"
      ]);
    }

    if ($user = User::where('google_id', Session::get('google_id'))->first()) {
      $data = array_merge([], Input::except(['lights', 'username', 'google_id']));

      if(Input::has('google_id'))
      // prevent overriding an empty username
      if(Input::has('username') && !empty(Input::get('username'))) {
        $data['username'] = Input::get('username');
      }

      // format light data
      if (Input::has('lights')) {
        $data['lights'] = json_encode(Input::get('lights'));
      }
      $user->update($data);
      return response()->json($user);
    }

    return response()->json([
      'error' => sprintf('user not found matching google_id: %s', Session::get('google_id'))
    ]);
  }
}