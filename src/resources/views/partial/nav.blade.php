<div id="nav">
    <div class="visible-loading text-center">
        {{ trans('hue.app loading') }}
    </div>
    <div class="visible-user">
        <div class="inner">
            <button id="triggerLightsOn" class="btn btn-primary" data-event-trigger="special:on">
                <i class="material-icons md-36">highlight</i> <span class="hidden-xs">{{ trans('hue.all lights on') }}</span>
            </button>
            <button id="triggerLightsOff" class="btn btn-primary" data-event-trigger="special:off">
                <i class="material-icons md-36">lightbulb_outline</i> <span class="hidden-xs">{{ trans('hue.all lights off') }}</span>
            </button>
            <div class="pull-right">
                <button id="triggerHome" class="btn btn-primary" data-event-trigger="request:home">
                    <i class="material-icons">lightbulb_outline</i> <span class="hidden-xs">{{ trans('home') }}</span>
                </button>
                <button id="triggerGroups" class="btn btn-primary" data-event-trigger="request:groups">
                    <i class="material-icons">lightbulb_outline</i><i class="material-icons">lightbulb_outline</i><i
                            class="material-icons">lightbulb_outline</i> <span class="hidden-xs">{{ trans('hue.groups') }}</span>
                </button>
                <button id="triggerSettings" class="btn btn-primary" data-event-trigger="request:settings">
                    <i class="material-icons">settings</i> <span class="hidden-xs">{{ trans('hue.settings') }}</span>
                </button>
                <button id="triggerFullscreen" class="btn btn-primary" data-event-trigger="request:fullscreen">
                    <i class="material-icons">fullscreen</i> <span>{{ trans('hue.fullscreen') }}</span>
                </button>

                <button id="triggerFullscreenExit" class="btn btn-primary" data-event-trigger="request:fullscreen_exit">
                    <i class="material-icons">fullscreen_exit</i> <span class="hidden-xs">{{ trans('hue.exit fullscreen') }}</span>
                </button>
            </div>
        </div>
    </div>
</div>