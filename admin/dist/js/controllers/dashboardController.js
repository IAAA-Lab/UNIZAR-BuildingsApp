$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    /*var firstLoad = true;

    $('body').ready( function () {
        console.log("Hash", window.location.hash);
        if (window.location.hash.length > 0 && firstLoad) {
            $('body').mask('Loading...');
            var target = window.location.hash + '.html';
            console.log("Go to: ", target);
            firstLoad = false;
            $('#page-wrapper').empty();
            $('#page-wrapper').load(target,{},function(){ $('body').unmask(); });
        }
    });*/

    $('.dropdown-toggle').click(function(e){
        var dropdown_user = $('.dropdown-user');
        console.log("Dropdown user visible", dropdown_user.is(":visible"));
        if (!dropdown_user.is(":visible")) {
            dropdown_user.css('display','block');
        } else {
            dropdown_user.css('display','none');
        }
    });

    $('#logout-link').click(function(e){
        e.preventDefault();
        $('body').mask('Loading...');
        Cookies.remove('session-admin-cookie');
        sessionStorage.removeItem('userData');
        window.location.href = 'login.html';
    });

    $('.go-to').click(function(e){
        $('body').mask('Loading...');
        var target = $(this).attr('href');
        console.log("Go to: ", target);
        $('#page-wrapper').empty();
        $('#page-wrapper').load(target,{},function(){ $('body').unmask(); });
        window.location.hash = target.split('.html')[0];
        e.preventDefault();
    });
});