function formatSizeUnits(bytes) {
    if (bytes >= 1000000000) {
        bytes = (bytes / 1000000000).toFixed(2) + ' GB';
    } else if (bytes >= 1000000) {
        bytes = (bytes / 1000000).toFixed(2) + ' MB';
    } else if (bytes >= 1000) {
        bytes = (bytes / 1000).toFixed(2) + ' KB';
    } else if (bytes > 1) {
        bytes = bytes + ' bytes';
    } else if (bytes == 1) {
        bytes = bytes + ' byte';
    } else {
        bytes = '0 byte';
    }
    return bytes;
}

function sliceStr(str) {
    if (str.length > 30) {
        str = str.slice(0, 15) + "..." + str.slice(str.length - 10)
    }
    return str;
}


function checkUpload() {
    if ($('#img_list li').length) {
        if (!$('#img_list li.loading').length && $('.img_bbcode').length) {
            var all = [];
            $('#img_list li').each(function() {
                var $this = $(this);
                if ($this.hasClass('success')) {
                    all.push($this.find('.img_bbcode').val());
                } else {
                    all.push("Lỗi ảnh " + $this.find("img").data("name"));
                }
            });
            $('#img_mess').val(all.join('\n\n'));
            $('#img_desc').val($('.img_bbcode:first').data('thumb'));
            $('#img_data').slideDown(function() {
                $('html,body').animate({
                    scrollTop: $('#img_data').offset().top
                });
            });
        }
    } else {
        $('#img_reset').click();
    }
}

$('#img_choose_wrap').on('change', '#img_choose', function() {
    $('#img_upload').prop('disabled', true);
    $.each(this.files, function(index, file) {
        if (/^image\/(jpeg|png|bmp|gif)$/.test(this.type)) {
            var n = file.name;
            if (!$('img[data-name="' + n + '"]').length) {
                var reader = new FileReader();
                var image = new Image();
                reader.readAsDataURL(file);
                reader.onload = function(_file) {
                    image.src = _file.target.result;
                    image.onerror = function() {
                        console.log('Image Error');
                        return false;
                    };
                    image.onload = function() {
                        var w = this.width;
                        var h = this.height;
                        var $img = $(this).attr({
                            'class': 'watermark',
                            'data-width': w,
                            'data-height': h,
                            'data-name': n
                        });
                        $('#img_list').append($img);
                        $img.wrap('<li class="ui-state-default"></li>');
                        $img.after('<div class="img_close">close</div><div class="img_details"><p><strong>Name</strong>: ' + sliceStr(n) + '</p><p><strong>Size</strong>: (' + w + 'x' + h + ') ' + formatSizeUnits(file.size) + '</p></div><div class="img_progress_bar"><div class="img_progress"></div></div>');
                    };
                };
            }
        }
    });

    $('#img_choose_wrap').html('<input id="img_choose" type="file" multiple accept="image/png, image/jpeg, image/gif, image/bmp" /><span>Chọn ảnh</span>');

    setTimeout(function() {
        wmark.init({
            "path": "data:image/png;base64,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"
        });
    }, 500);
    $("#img_list").sortable({
        placeholder: "ui-state-highlight",
        update: function(event, ui) {
            checkUpload();
        }
    }).disableSelection();
    $('#img_upload').prop('disabled', false);
});

$('#img_upload').click(function() {
    $('#img_list li:not(.success)').each(function(index, el) {
        var $this = $(this);
        var dataImg = $this.find('img').attr('src').replace(/data:image\/.+;base64\,/, '');
        $this.removeClass('error').addClass('loading');
        $.ajax({
            url: 'https://api.imgur.com/3/image',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(evt) {
                    if (evt.lengthComputable) {
                        $this.find('.img_progress').css({
                            width: (evt.loaded / evt.total * 100) + '%'
                        });
                    }
                }, false);
                return xhr;
            },
            method: "POST",
            headers: {
                Authorization: "Client-ID 376e1e3bc7aaf7c"
            },
            data: {
                image: dataImg,
                type: 'base64'
            },
            success: function(response) {
                var link = response.data.link;
                $this.removeClass('loading').addClass('success');
                $this.find('.img_details').html('<p><input class="img_bbcode" data-thumb="' + link.replace(/(.+)(\.)(png|jpg|gif|bmp)$/, '$1s.$3') + '" onclick="this.select();" type="text" value="[img]' + link + '[/img]" /></p><p><a href="' + link + '" target="_blank">Xem ảnh</a><a href="http://imgur.com/delete/' + response.data.deletehash + '" target="_blank">Xóa ảnh</a></p>');
                checkUpload();
            },
            error: function(response) {
                $this.removeClass('loading').addClass('error');
                checkUpload();
                console.warn(response);
            }
        });
    });
});

$("#img_reset").click(function() {
    $('#img_list').empty();
    $('#img_data').slideUp();
});

$('#img_list').on('click', '.img_close', function() {
    $(this).parent().remove();
    checkUpload();
});

$('#img_type').change(function(){
    $('#img_forum').val(this.value);
});