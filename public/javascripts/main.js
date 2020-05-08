const err_flash = $('.error');
if (err_flash) {
    $('.error').transition('fade down')
    function expire(){err_flash.transition('fade down')}
    setTimeout(expire, 3000)
}