const err_flash = $('.flash');
if (err_flash) {
    function expire(){err_flash.transition('fade down')}
    setTimeout(expire, 3000)
}