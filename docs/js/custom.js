(function ($) {
    function hideSecondLevelMenu() {
        $('ul.bs-sidenav li.second-level').hide();
    }
    
    function toggleSecondLevel(el) {
        hideSecondLevelMenu();
        $(el).find('.second-level').show();
    }

    $('li.first-level').click(function () {
        toggleSecondLevel(this);
    });

    hideSecondLevelMenu();
})(jQuery);