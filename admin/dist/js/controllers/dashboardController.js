$(function() {
    
    //Check for cookies
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = 'login.html';
            }
        }
    };

    //Load page pending on window location hash
    $(document).ready(function(){
        var children = $('#page-wrapper').children(),
            hash = window.location.hash;
        if (typeof(children.lenght) == 'undefined' && hash.length > 0) {
            $('body').mask('Loading...');
            var target = hash.substr(1,hash.length-1) + '.html';
            console.log('Go to: ', target);
            $('#page-wrapper').empty();
            $('#page-wrapper').load(target,{},function(){ $('body').unmask(); });
        }
    });

    //User menu behaviour
    $('.dropdown-toggle').click(function(e){
        var dropdown_user = $('.dropdown-user');
        console.log('Dropdown user visible', dropdown_user.is(':visible'));
        if (!dropdown_user.is(':visible')) {
            dropdown_user.css('display','block');
        } else {
            dropdown_user.css('display','none');
        }
    });

    //Logout action
    $('#logout-link').click(function(e){
        e.preventDefault();
        $('body').mask('Loading...');
        Cookies.remove('session-admin-cookie');
        sessionStorage.removeItem('userData');
        window.location.href = 'login.html';
    });

    //Transition between pages
    $('.go-to').click(function(e){
        $('body').mask('Loading...');
        var target = $(this).attr('href');
        console.log('Go to: ', target);
        $('#page-wrapper').empty();
        $('#page-wrapper').load(target,{},function(){ $('body').unmask(); });
        window.location.hash = target.split('.html')[0];
        e.preventDefault();
    });
});