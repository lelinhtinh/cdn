// Chuyển video khi click vào BBcode table
// $('.video_Ytb_img').click(function() {
//     $(this).replaceWith('<iframe width="560" height="315" src="//www.youtube.com/embed/' + $(this).data('id') + '?autoplay=1&autohide=1" frameborder="0" allowfullscreen></iframe>');
// });
//
// Chuyển posting đến trang html
// var postfId=$('.frm-buttons input[name="f"]').val();$('.frm-buttons input[name="mode"]').val()==='newtopic'&&postfId.length&&/^(121|1|32)$/.test(postfId)&&window.location.replace("/h61-youtube?postto="+postfId);

// Reset khung nhập liệu

function resetForm(txt) {
    $('#ytb_overlay').css('backgroundImage', 'url(//i39.servimg.com/u/f39/18/83/32/63/blurry10.jpg)');
    $('#ytb_title, #ytb_mess, #ytb_query, #ytb_desc').val('');
    $('#ytb_form').removeClass('show');
    $('#ytb_preview, #ytb_result').empty();
    alert(txt);
}


// Tải API Youtube ver 3

function loadAPIClientInterfaces() {
    gapi.client.setApiKey('AIzaSyCm_eAeCb4z_0L_jic6-5UwsLNrWln3Sik');
    gapi.client.load('youtube', 'v3', function() {
        handleAPILoaded();
    });
}

// Khi tải API Youtube xong

function handleAPILoaded() {
    $('#ytb_query').val('');
    $('#ytb_query, #ytb_search').attr('disabled', false);
}

// Hiển thị video khi click vào kết quả

function showvideo() {
    $('#ytb_form').addClass('show');
    $('.ytb_search_result:first').click();
    $('#ytb_query').val('');
    $('#ytb_title').focus();
}

// Cắt ngắn phần chú thích dài

function slicelong(txt) {
    if (txt.length > 185) {
        txt = txt.slice(0, 175) + '...';
    }
    return txt;
}

// Tìm video theo từ khóa hoặc URL

function search() {
    var url = $('#ytb_query').val();
    if (url !== null && url !== '') {
        if (/^https?:\/\/(www\.youtube\.com|youtu\.be)\/.+/.test(url)) {
            var matches = url.match(/(?:v=|v\/|embed\/|youtu.be\/)([a-zA-Z0-9_\-]{11})/);
            if (matches) {
                url = matches[1];
                var request = gapi.client.youtube.videos.list({
                    id: url,
                    part: 'snippet'
                });
                request.execute(function(response) {
                    var item = response.items;
                    if (item === undefined) {
                        resetForm('Không tìm thấy video, hãy thử lại với từ khóa khác.');
                    } else {
                        var video = item[0].snippet;
                        console.log(video);
                        $('#ytb_result').html('<div class="ytb_search_result" data-id="' + url + '"><img src="//i.ytimg.com/vi/' + url + '/1.jpg" /><h2>' + video.title + '</h2><p>' + slicelong(video.description) + '</p></div>');
                        showvideo();
                    }
                });
            } else {
                resetForm('URL video Youtube bạn nhập vào không đúng định dạng.');
            }
        } else {
            var request = gapi.client.youtube.search.list({
                q: url,
                part: 'snippet',
                type: 'video'
            });
            request.execute(function(response) {
                var item = response.items;
                if (item === undefined) {
                    resetForm('Không tìm thấy video, hãy thử lại với từ khóa khác.');
                } else {
                    var ytb = '';
                    $.each(item, function(index, val) {
                        var y_snip = val.snippet;
                        y_id = val.id.videoId;
                        ytb += '<div class="ytb_search_result" data-id="' + y_id + '"><img src="//i.ytimg.com/vi/' + y_id + '/default.jpg" /><h2>' + y_snip.title + '</h2><p>' + slicelong(y_snip.description) + '</p></div>';
                    });
                    $('#ytb_result').html(ytb);
                    showvideo();
                }
            });
        }
    }
}

$(function() {
    if (location.search.indexOf('postto=') !== -1) {
        $('#ytb_type > option[value="' + location.search.match(/postto=(\d+)/)[1] + '"]').prop('selected', true);
    }
    $('#ytb_result').on('click', '.ytb_search_result', function() {
        var $this = $(this),
            t_id = $this.data('id');
        $('#ytb_overlay').css('backgroundImage', 'url(//i.ytimg.com/vi/' + t_id + '/0.jpg)');
        $('.ytb_search_result.selected').removeClass('selected');
        $this.addClass('selected');
        $('#ytb_title').val($this.find('h2').text());
        $('#ytb_mess').val('[img]http://i3.ytimg.com/vi/' + t_id + '/0.jpg[/img][youtube]' + t_id + '[/youtube]');
        $('#ytb_preview').html('<iframe width="560" height="315" src="//www.youtube.com/embed/' + t_id + '?autoplay=1&autohide=1" frameborder="0" allowfullscreen></iframe>');
        $('#ytb_desc').val('http://i.ytimg.com/vi/' + t_id + '/0.jpg');
        $('#ytb_data').show();
        $('html,body').animate({
            scrollTop: $('#ytb_preview').offset().top
        });
    });

    $('#ytb_submit').click(function() {
        alert('Vui lòng chờ trong giây lát...');
        $.post("/post", {
            mode: "newtopic",
            f: $('#ytb_type').val(),
            subject: $('#ytb_title').val(),
            description: $('#ytb_desc').val(),
            message: $('#ytb_mess').val(),
            post: "Ok"
        }).done(function(data) {
            $('.zzBoxes').remove();
            var $link = $(data).find('p.message a[href^="/viewtopic"]');
            if ($link.length) {
                // $.boxes({
                //     mode: 'alert',
                //     width: "370px",
                //     messString: false,
                //     message: $('.message > p.message').html()
                // });
                resetForm('Gửi video thành công!');
                window.location.replace($link[0].href);
            } else {
                alert('Lỗi! Bài viết chưa được gửi.');
            }
        }).fail(function() {
            alert('Lỗi! Bài viết chưa được gửi.');
        });
    });
});
