<div id="settings" class="col-md-12">
    <h2>{{ trans('hue.connect bridge') }}</h2>
    <div class="form-group">
        {{ trans('hue.select bridge') }}
        <table class="table">
            <tr>
                <th>Bridge ID</th>
                <th>Bridge IP</th>
                <th></th>
            </tr>
            <tr>
                <td>Philips Hue</td>
                <td>102.168.86.104</td>
                <td><button class="btn btn-primary btn-raised">{{ trans('hue.choose') }} <i class="material-icons">keyboard_arrow_right</i></button></td>
            </tr>
        </table>
    </div>
    <h2>{{ trans('hue.display') }}</h2>
    <div class="form-group">
        <label><input id="displayFlip" data-style='{"transform":"rotate(180deg)"}' type="checkbox"> Flip display</label>
    </div>
    <h2>{{ trans('hue.preferences') }}</h2>
    <div class="form-group">
        <label>{{ trans('hue.default page') }}</label>
        <select class="form-control">
            <option>{{ trans('hue.lights') }}</option>
            <option>{{ trans('hue.groups') }}</option>
        </select>
    </div>
    <div class="form-group">
        <label>{{ trans('hue.display all lights') }}</label>
        <select class="form-control">
            <option>{{ trans('hue.yes') }}</option>
            <option>{{ trans('hue.no') }}</option>
        </select>
    </div>
</div>