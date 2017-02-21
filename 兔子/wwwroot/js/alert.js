function alert() {
    $('.bigAlert').fadeIn(500)
    console.log($('.bigAlert'))
}

$('.bigAlert img').click(function(){
    console.log(1)
    $('.bigAlert').fadeOut(500)
})

