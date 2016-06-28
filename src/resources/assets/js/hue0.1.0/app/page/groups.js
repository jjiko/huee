$.getScript('/vendor/telerik/kendoui/kendo.all.min.js', function () {
    var $lights = $("#lights").clone(),
        $groupNames = $(".group-name-text"),
        groups = [];

    // Handle group name field
    $groupNames.each(function (i, e) {
        if ($(e).text() == "") {
            $(e).append($(e).attr('data-placeholder-text'));
        }
        $(e).on('click', function (evt) {
            if ($(this).text() == $(this).attr('data-placeholder-text')) {
                $(this).empty();
            }
        });

        $(e).on('blur', function (evt) {
            if ($(this).text() == "") {
                $(e).append($(this).attr('data-placeholder-text'));
            }
        });
    });

    var lightsArray = $lights.children('.light-col').detach();
    lightsArray.sort(function (a, b) {
        var $a = $(a).find('.light-label-text').text();
        var $b = $(b).find('.light-label-text').text();
        return $a.toUpperCase().localeCompare($b.toUpperCase());
    });
    $.each(lightsArray, function (i, el) {
        $lights.append(el);
    });

    $lights.appendTo("#group-lights");


    function lightOnDragStart(e) {
        console.log('lightOnDragStart', this);
        $(e).addClass('hollow');
        $('.group-hint').text('Drop here');
    }

    function droptargetOnDragEnter(e) {
        console.log("droptargetOnDragEnter", this);
    }

    function droptargetOnDragLeave(e) {
        console.log("droptargetOnDragLeave", this);
    }

    function droptargetOnDrop(e) {
        $('.group-hint').empty();

        e.draggable.element.detach();
        e.draggable.element.appendTo(e.dropTarget);
    }

    function lightOnDragEnd(e) {
        $(e).removeClass('hollow');
    }

    $("#group-lights .light-col").kendoDraggable({
        hint: function (el) {
            return el.clone();
        },
        dragstart: lightOnDragStart,
        dragend: lightOnDragEnd
    })
    $(".group, #group-lights").kendoDropTarget({
        drop: droptargetOnDrop
    });

    $("#save").on('click', function (evt) {
        var T_groupsDisplay = "";
        $('#group-items .group-item').each(function (i, e) {
            var group = {
                name: $(e).find('.group-name-text').text(),
                items: []
            }

            if (group.name == $(e).find('.group-name-text').attr('data-placeholder-text')) {
                alert('Enter a group name before adding this group.')
                return false;
            }

            if ($(e).find('.btn').length < 2) {
                alert('Add at least 2 lights to the group');
                return false;
            }

            $(e).find('.btn').each(function (i, light) {
                var $light = $(light);
                group.items.push($light.attr('data-id'));
            });

            T_groupsDisplay += '<div>{{NAME}} {{ITEMS}} <i data-event-trigger="group:delete" class="material-icons">delete forever</i></div>'.replace('{{NAME}}', group.name).replace('{{ITEMS}}', function () {
                var lightsIcons = '<i class="material-icons">lightbulb_outline</i><sup>x' + group.items.length + '</sup>';
                //for (i = 1; i <= group.items.length; i++) {
                //    lightsIcons += '<i class="material-icons">lightbulb_outline</i>';
                //}
                return lightsIcons;
            });

            groups.push(group);
            $('#group-groups').append($('<div>').attr('data-group', JSON.stringify(group)).append($(T_groupsDisplay)));
        });
    });
});